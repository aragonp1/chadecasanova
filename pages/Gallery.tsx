
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment,
  setDoc,
  getDoc,
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
  Heart, 
  MessageSquare, 
  Upload, 
  X, 
  User as UserIcon,
  LogOut,
  Image as ImageIcon,
  Smile,
  Trash2,
  ArrowLeft,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PhotoCard: React.FC<{ photo: Photo; user: User | null; onDelete: (id: string) => void; onDownload: (url: string, id: string) => void }> = ({ photo, user, onDelete, onDownload }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const urls = photo.urls || (photo.url ? [photo.url] : []);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % urls.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length);
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    if (urls.length <= 1) return;
    const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
    if (swipe && offset.x > 0) {
      prev();
    } else if (swipe && offset.x < 0) {
      next();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1
    })
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl border border-primary/5 group"
    >
      {/* Photo Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {photo.authorPhotoUrl ? (
            <img 
              src={photo.authorPhotoUrl} 
              className="w-10 h-10 rounded-full object-cover border border-primary/10" 
              alt={photo.authorName}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {photo.authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-[#2c1810]">{photo.authorName}</p>
            <p className="text-xs text-olive opacity-60">
              {photo.timestamp?.toDate().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onDownload(urls[currentIndex], `foto-${photo.id}-${currentIndex}.png`)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
            title="Baixar Foto Atual"
          >
            <Download className="w-4 h-4" />
          </button>
          {user?.uid === photo.authorUid && (
            <button 
              onClick={() => onDelete(photo.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Excluir Foto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Image / Carousel */}
      <div className="relative aspect-square sm:aspect-video bg-gray-100 overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img 
            key={currentIndex}
            src={urls[currentIndex]} 
            alt={photo.caption} 
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag={urls.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              urls.length > 1 ? "cursor-grab active:cursor-grabbing" : ""
            )}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {urls.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all z-10 hidden sm:block"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all z-10 hidden sm:block"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {urls.map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === currentIndex ? "bg-white w-4" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-6 pt-0 mt-4">
        {photo.caption && (
          <p className="text-[#2c1810] leading-relaxed italic font-serif text-lg">
            "{photo.caption}"
          </p>
        )}
      </div>
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'));
    const unsubscribePhotos = onSnapshot(q, (snapshot) => {
      const photosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      setPhotos(photosData);
      setIsInitialLoading(false);
    }, (error) => {
      console.error("Erro ao buscar fotos:", error);
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
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Login cancelado: o usuário fechou a janela de autenticação.");
        return;
      }
      console.error("Erro ao fazer login:", error);
      alert("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => auth.signOut();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (previewUrls.length + files.length > 5) {
      alert("Você pode enviar no máximo 5 fotos por vez.");
      return;
    }

    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
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
            
            // Compress to JPEG with 0.7 quality
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl);
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
        setSelectedFiles(prev => [...prev, file]);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        alert(`Erro ao processar a imagem ${file.name}`);
      }
    });
  };

  const removePreview = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
        reactions: {}
      });
      
      setShowUploadModal(false);
      setCaption('');
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      alert("Erro ao enviar foto. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (photoId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta foto?")) return;
    try {
      await deleteDoc(doc(db, 'photos', photoId));
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-32">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-olive hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Início
        </Link>
      </div>

      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Galeria de Momentos</h1>
        <p className="text-olive opacity-80">Compartilhe suas fotos do Chá de Casa Nova!</p>
      </header>

      {/* Auth Section */}
      <div className="mb-8 flex justify-center">
        {!user ? (
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all text-gray-700 font-medium disabled:opacity-70"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            )}
            {isLoggingIn ? 'Entrando...' : 'Entrar com Google para participar'}
          </button>
        ) : (
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pl-4 rounded-full border border-primary/10">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} className="w-8 h-8 rounded-full" alt={user.displayName || ''} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-medium text-[#2c1810] hidden sm:inline">{user.displayName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {user && (
        <div className="mb-10 flex justify-center">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="group relative flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all font-bold text-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Upload className="w-6 h-6" />
            Enviar Foto
          </button>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 gap-8">
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-olive font-medium animate-pulse">Carregando galeria...</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {photos.map((photo) => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  user={user} 
                  onDelete={handleDelete} 
                  onDownload={handleDownload} 
                />
              ))}
            </AnimatePresence>

            {photos.length === 0 && (
              <div className="text-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-primary/20">
                <ImageIcon className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-olive font-medium">Nenhuma foto enviada ainda.</p>
                <p className="text-sm text-olive/60">Seja o primeiro a compartilhar!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUploading && setShowUploadModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-[#2c1810]">Enviar Fotos</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-grow pb-10">
                {/* File Drop/Select */}
                {previewUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={url} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                        <button 
                          onClick={() => removePreview(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {previewUrls.length < 5 && (
                      <button 
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        <Plus className="w-6 h-6 text-gray-300" />
                        <span className="text-[10px] text-gray-400 mt-1">Adicionar</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <Camera className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Clique para selecionar fotos</p>
                    <p className="text-[10px] text-gray-400 mt-1">Máximo 5 fotos</p>
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

                {/* Caption Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#2c1810] flex items-center gap-2">
                    <Smile className="w-4 h-4 text-primary" />
                    Legenda (opcional)
                  </label>
                  <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Escreva algo sobre estes momentos..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-24"
                  />
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={isUploading || previewUrls.length === 0}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                    isUploading || previewUrls.length === 0 
                      ? "bg-gray-300 cursor-not-allowed" 
                      : "bg-primary hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                  )}
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Publicar na Galeria
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
