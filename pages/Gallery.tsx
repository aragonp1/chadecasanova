
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
  Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EMOJIS = ['❤️', '😍', '😂', '🔥', '✨', '🙌'];

const Gallery: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // ~800KB limit for Firestore base64
        alert("A imagem é muito grande. Por favor, escolha uma imagem menor que 800KB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !previewUrl) return;

    setIsUploading(true);
    try {
      await addDoc(collection(db, 'photos'), {
        url: previewUrl,
        caption: caption,
        authorName: user.displayName || 'Convidado',
        authorUid: user.uid,
        timestamp: serverTimestamp(),
        reactions: {}
      });
      
      setShowUploadModal(false);
      setCaption('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      alert("Erro ao enviar foto. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReaction = async (photoId: string, emoji: string) => {
    if (!user) {
      handleLogin();
      return;
    }

    const reactionRef = doc(db, 'photos', photoId, 'reactions', user.uid);
    const photoRef = doc(db, 'photos', photoId);

    try {
      const reactionDoc = await getDoc(reactionRef);
      
      if (reactionDoc.exists()) {
        const oldEmoji = reactionDoc.data().type;
        if (oldEmoji === emoji) {
          // Remove reaction
          await deleteDoc(reactionRef);
          await updateDoc(photoRef, {
            [`reactions.${emoji}`]: increment(-1)
          });
        } else {
          // Change reaction
          await setDoc(reactionRef, { type: emoji, userId: user.uid });
          await updateDoc(photoRef, {
            [`reactions.${oldEmoji}`]: increment(-1),
            [`reactions.${emoji}`]: increment(1)
          });
        }
      } else {
        // New reaction
        await setDoc(reactionRef, { type: emoji, userId: user.uid });
        await updateDoc(photoRef, {
          [`reactions.${emoji}`]: increment(1)
        });
      }
    } catch (error) {
      console.error("Erro ao reagir:", error);
    }
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
    <div className="w-full max-w-2xl mx-auto pb-20">
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
                <motion.div 
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-primary/5 group"
                >
                  {/* Photo Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {photo.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#2c1810]">{photo.authorName}</p>
                        <p className="text-xs text-olive opacity-60">
                          {photo.timestamp?.toDate().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    {user?.uid === photo.authorUid && (
                      <button 
                        onClick={() => handleDelete(photo.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative aspect-square sm:aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Footer / Actions */}
                  <div className="p-6">
                    {photo.caption && (
                      <p className="text-[#2c1810] mb-6 leading-relaxed italic font-serif text-lg">
                        "{photo.caption}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(photo.id, emoji)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:scale-110 active:scale-95",
                            photo.reactions?.[emoji] 
                              ? "bg-primary/10 border-primary/20 text-primary" 
                              : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-primary/20"
                          )}
                        >
                          <span className="text-lg">{emoji}</span>
                          {photo.reactions?.[emoji] && (
                            <span className="text-sm font-bold">{photo.reactions[emoji]}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#2c1810]">Enviar Foto</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* File Drop/Select */}
                <div 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={cn(
                    "relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                    previewUrl ? "border-primary/50" : "border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                  )}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold bg-black/40 px-4 py-2 rounded-full">Trocar Foto</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500 font-medium">Clique para selecionar uma foto</p>
                      <p className="text-[10px] text-gray-400 mt-1">Máximo de 800KB</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Caption Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#2c1810] flex items-center gap-2">
                    <Smile className="w-4 h-4 text-primary" />
                    Legenda (opcional)
                  </label>
                  <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Escreva algo sobre este momento..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-24"
                  />
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={isUploading || !previewUrl}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                    isUploading || !previewUrl 
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
