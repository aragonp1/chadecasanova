
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  deleteDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { Photo } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  X, 
  User as UserIcon,
  LogOut,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  Loader2,
  Download,
  Plus,
  CheckCircle2,
  Check
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Gallery: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  
  // Estados para seleção e download em massa
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // "photoId-index"
  
  const [caption, setCaption] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'photos'));
    const unsubscribePhotos = onSnapshot(q, (snapshot) => {
      try {
        const photosData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            authorName: data.authorName || 'Convidado'
          };
        }) as Photo[];
        
        const sortedPhotos = photosData.sort((a, b) => {
          const timeA = a.timestamp?.toMillis?.() || 0;
          const timeB = b.timestamp?.toMillis?.() || 0;
          return timeB - timeA;
        });
        
        setPhotos(sortedPhotos);
        setError(null);
      } catch (err) {
        console.error("Erro ao processar dados das fotos:", err);
        setError("Erro ao processar fotos.");
      } finally {
        setIsInitialLoading(false);
      }
    }, (err) => {
      console.error("Erro ao buscar fotos:", err);
      setError("Não foi possível carregar as fotos.");
      setIsInitialLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePhotos();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => auth.signOut();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
      });
    };

    files.forEach(async (file) => {
      try {
        const compressedDataUrl = await compressImage(file);
        setPreviewUrls(prev => [...prev, compressedDataUrl]);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      }
    });
  };

  const handleUpload = async () => {
    if (!user || previewUrls.length === 0) return;

    setIsUploading(true);
    try {
      await addDoc(collection(db, 'photos'), {
        urls: previewUrls,
        caption: caption,
        authorName: user.displayName || 'Convidado',
        authorUid: user.uid,
        authorPhotoUrl: user.photoURL,
        timestamp: serverTimestamp(),
      });
      
      setShowUploadModal(false);
      setCaption('');
      setPreviewUrls([]);
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (!window.confirm("Deseja excluir esta foto?")) return;
    try {
      await deleteDoc(doc(db, 'photos', photoId));
      if (selectedPhoto?.id === photoId) setSelectedPhoto(null);
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
    }
  };

  const handleDownload = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = `foto-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelection = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const handleBulkDownload = async () => {
    if (selectedItems.length === 0) return;
    
    // Para cada item selecionado, encontrar a URL e baixar
    selectedItems.forEach((itemId) => {
      const [photoId, indexStr] = itemId.split('-');
      const index = parseInt(indexStr);
      const photo = photos.find(p => p.id === photoId);
      if (photo) {
        const url = photo.urls?.[index] || photo.url;
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.download = `foto-${photoId}-${index}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
    
    setIsSelectionMode(false);
    setSelectedItems([]);
  };

  // Transformar fotos em uma lista plana de itens individuais
  const flatPhotos = photos.flatMap(photo => {
    const urls = photo.urls || (photo.url ? [photo.url] : []);
    return urls.map((url, index) => ({
      ...photo,
      displayUrl: url,
      itemIndex: index,
      uniqueId: `${photo.id}-${index}`
    }));
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32">
      {/* Header Estilo Boho */}
      <div className="w-full flex flex-col items-center animate-fade-in pt-8 px-4">
        <div className="w-full max-w-2xl flex items-center justify-between mb-6">
          <Link to="/" className="p-2 -ml-2 text-olive hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            {user && (
              <button 
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  setSelectedItems([]);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all",
                  isSelectionMode ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"
                )}
              >
                {isSelectionMode ? "Cancelar" : "Selecionar"}
              </button>
            )}
          </div>
        </div>

        <header className="w-full text-center flex flex-col items-center mb-8">
          <div className="mb-4 text-primary animate-bounce">
            <span className="material-symbols-outlined text-5xl">photo_library</span>
          </div>
          <h1 className="text-[#2c1810] font-serif text-[40px] md:text-[48px] font-bold leading-[1.1] mb-2 tracking-tight">
            Galeria de Fotos<br/>
            <span className="text-primary italic font-normal block mt-1">Momentos Especiais</span>
          </h1>
          <p className="text-olive text-base md:text-lg font-normal leading-relaxed max-w-[300px] mx-auto opacity-80">
            Compartilhe e reviva os melhores momentos do nosso encontro.
          </p>
        </header>
      </div>

      <div className="max-w-4xl mx-auto px-1">
        {/* Auth & Upload Bar */}
        <div className="px-3 py-4 flex items-center justify-between gap-4">
          {!user ? (
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-2xl text-sm font-bold text-gray-700 active:scale-95 transition-transform shadow-sm"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="" />}
              Entrar para Participar
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-white p-2 rounded-2xl border border-primary/10 shadow-sm">
              <div className="flex items-center gap-2 pl-2">
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-primary/10" alt="" />
                <span className="text-xs font-bold text-[#2c1810] truncate max-w-[120px]">{user.displayName}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowUploadModal(true)} className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                  <Plus className="w-5 h-5" />
                </button>
                <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {isSelectionMode && selectedItems.length > 0 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white px-6 py-4 rounded-full shadow-2xl border border-primary/20 flex items-center gap-6"
            >
              <span className="text-sm font-bold text-[#2c1810]">{selectedItems.length} selecionadas</span>
              <button 
                onClick={handleBulkDownload}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-primary/20"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid de Fotos */}
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-olive font-medium animate-pulse">Carregando momentos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {flatPhotos.map((item) => {
              const isSelected = selectedItems.includes(item.uniqueId);
              return (
                <motion.div
                  key={item.uniqueId}
                  layoutId={item.uniqueId}
                  onClick={() => isSelectionMode ? toggleSelection(null as any, item.uniqueId) : setSelectedPhoto(item as any)}
                  className="relative aspect-square cursor-pointer overflow-hidden group"
                >
                  <img 
                    src={item.displayUrl} 
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                      isSelected && "opacity-50 scale-90"
                    )} 
                    alt="" 
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Avatar do Autor no Canto */}
                  <div className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full border border-white/50 overflow-hidden shadow-sm z-10">
                    {item.authorPhotoUrl ? (
                      <img src={item.authorPhotoUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[8px] text-primary font-bold">
                        {item.authorName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Ícone de Lixo (se for o dono) */}
                  {!isSelectionMode && user?.uid === item.authorUid && (
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-black/30 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Indicador de Seleção */}
                  {isSelectionMode && (
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center transition-all",
                      isSelected ? "bg-primary/20" : "bg-transparent"
                    )}>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-primary border-primary text-white" : "bg-white/20 border-white text-transparent"
                      )}>
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {photos.length === 0 && !isInitialLoading && (
          <div className="text-center py-20">
            <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Nenhuma foto ainda</p>
          </div>
        )}
      </div>

      {/* Modal de Upload */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUploading && setShowUploadModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Nova Publicação</h2>
                <button onClick={() => setShowUploadModal(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {previewUrls.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-4 snap-x">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative w-40 h-40 shrink-0 rounded-2xl overflow-hidden snap-center">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button 
                          onClick={() => setPreviewUrls(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-40 h-40 shrink-0 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Camera className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-sm font-bold text-gray-400">Selecionar Fotos</p>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div className="mt-6">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Legenda</label>
                  <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Escreva algo sobre este momento..."
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32 resize-none"
                  />
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={isUploading || previewUrls.length === 0}
                  className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  {isUploading ? 'Publicando...' : 'Publicar Agora'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Foto Expandida (Estilo Celular) */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div 
              layoutId={selectedPhoto.uniqueId}
              className="relative w-full h-full flex flex-col"
            >
              {/* Top Bar */}
              <div className="p-4 flex items-center justify-between text-white z-10">
                <button onClick={() => setSelectedPhoto(null)} className="p-2 bg-white/10 rounded-full">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDownload(e, selectedPhoto.displayUrl)}
                    className="p-2 bg-white/10 rounded-full"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  {user?.uid === selectedPhoto.authorUid && (
                    <button 
                      onClick={(e) => handleDelete(e, selectedPhoto.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center p-2">
                <div className="w-full max-h-full overflow-y-auto no-scrollbar flex items-center justify-center">
                  <img 
                    src={selectedPhoto.displayUrl} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                    alt="" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Info Bar */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 bg-gradient-to-t from-black/80 to-transparent text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-white/10 overflow-hidden">
                    {selectedPhoto.authorPhotoUrl ? (
                      <img src={selectedPhoto.authorPhotoUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{selectedPhoto.authorName}</p>
                    <p className="text-[10px] opacity-60">
                      {selectedPhoto.timestamp?.toDate ? selectedPhoto.timestamp.toDate().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'Recentemente'}
                    </p>
                  </div>
                </div>
                {selectedPhoto.caption && (
                  <p className="text-lg font-medium leading-relaxed italic">
                    "{selectedPhoto.caption}"
                  </p>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
