
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
  Maximize2
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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
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

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Estilo Celular */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <Link to="/" className="p-2 -ml-2 text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Galeria</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="max-w-4xl mx-auto px-1 pt-1">
        {/* Auth & Upload Bar */}
        <div className="px-3 py-4 flex items-center justify-between gap-4">
          {!user ? (
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-xl text-sm font-bold text-gray-700 active:scale-95 transition-transform"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserIcon className="w-4 h-4" />}
              Entrar para Postar
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full" alt="" />
                <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">{user.displayName?.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowUploadModal(true)} className="p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                  <Plus className="w-5 h-5" />
                </button>
                <button onClick={handleLogout} className="p-2 text-gray-400">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grid de Fotos */}
        {isInitialLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {photos.map((photo) => {
              const displayUrl = photo.urls?.[0] || photo.url;
              return (
                <motion.div
                  key={photo.id}
                  layoutId={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-square cursor-pointer overflow-hidden group"
                  whileHover={{ opacity: 0.9 }}
                >
                  <img 
                    src={displayUrl} 
                    className="w-full h-full object-cover" 
                    alt="" 
                    referrerPolicy="no-referrer"
                  />
                  {photo.urls && photo.urls.length > 1 && (
                    <div className="absolute top-2 right-2 p-1 bg-black/20 backdrop-blur-sm rounded-md">
                      <ImageIcon className="w-3 h-3 text-white" />
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
              layoutId={selectedPhoto.id}
              className="relative w-full h-full flex flex-col"
            >
              {/* Top Bar */}
              <div className="p-4 flex items-center justify-between text-white z-10">
                <button onClick={() => setSelectedPhoto(null)} className="p-2 bg-white/10 rounded-full">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDownload(e, selectedPhoto.urls?.[0] || selectedPhoto.url || '')}
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
                <div className="w-full max-h-full overflow-y-auto no-scrollbar">
                  {(selectedPhoto.urls || [selectedPhoto.url]).map((url, i) => (
                    <img 
                      key={i}
                      src={url} 
                      className="w-full h-auto rounded-lg mb-2" 
                      alt="" 
                      referrerPolicy="no-referrer"
                    />
                  ))}
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
