import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Apple, Mail, Heart, ChevronLeft, ChevronRight, Footprints, Award, FileHeart, MapPin, Bell, Sparkles, Bone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { PawTrail } from './components/PawTrail';
import { PetButton } from './components/PetButton';
import { toast, Toaster } from 'sonner@2.0.3';
import { FirebaseError } from 'firebase/app';
import { addToWaitlist } from './lib/waitlist';
import { AppleWatchScreen, IPhoneScreen } from './components/PreviewScreens';
import hanoImage from './hano.JPG';

export default function App() {
  const [email, setEmail] = useState('');
  const [activeSection, setActiveSection] = useState<'landing' | 'preview' | 'founder'>('landing');
  const [activeTab, setActiveTab] = useState<'iPhone' | 'Apple Watch'>('iPhone');
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const activeErrorToastId = useRef<string | number | null>(null);
  const MIN_SUBMIT_ANIMATION = 1200;
  const isLanding = activeSection === 'landing';
  const isFounder = activeSection === 'founder';
  const sectionPaddingTop = isLanding
    ? 'clamp(5rem, 10vh, 6.6rem)'
    : activeSection === 'preview'
    ? 'clamp(1.6rem, 4.5vh, 2.8rem)'
    : 'clamp(4rem, 9.5vh, 5.4rem)';
  const sectionAlignment = 'sm:items-start';
  const pageInitial = { opacity: 0, y: 14 };
  const pageAnimate = { opacity: 1, y: 0 };
  const pageExit = { opacity: 0, y: -14 };
  const pageTransition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] };

  const benefits = [
    { text: 'Smart walk & potty log', icon: Footprints, color: '#7BBF72' },
    { text: 'Habit streaks & memories', icon: Award, color: '#7BBF72' },
    { text: 'Vet-friendly health notes', icon: FileHeart, color: '#7BBF72' },
    { text: 'Sniff-spot map & grass finder', icon: MapPin, color: '#7BBF72' },
    { text: 'Activity tracking & insights', icon: Award, color: '#7BBF72' }
  ];

  const screens = ['Walk Logging', 'Streak Rewards', 'Health Notes', 'Map Finder', 'Activity'];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showErrorToast = (title: string, description: string) => {
    const toastId = toast.error(title, {
      description,
      duration: 3000,
      onDismiss: () => {
        if (activeErrorToastId.current === toastId) {
          setSubmitStatus('idle');
          activeErrorToastId.current = null;
        }
      },
      onAutoClose: () => {
        if (activeErrorToastId.current === toastId) {
          setSubmitStatus('idle');
          activeErrorToastId.current = null;
        }
      },
    });
    activeErrorToastId.current = toastId;
  };

  const handleNotify = async () => {
    // Prevent multiple clicks during submission
    if (isSubmitting) return;

    // Dismiss all previous toasts
    activeErrorToastId.current = null;
    toast.dismiss();

    // Reset status immediately on new click
    setSubmitStatus('idle');

    // Check if email is empty
    if (!email.trim()) {
      setSubmitStatus('error');
      showErrorToast('Please enter your email address', 'Get notified when we launch!');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setSubmitStatus('error');
      showErrorToast('Invalid email address', 'Please enter a valid email address');
      return;
    }

    const trimmedEmail = email.trim();

    setIsSubmitting(true);
    const now = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now();
    const startTime = now();
    
    try {
      const result = await addToWaitlist(trimmedEmail);

      const elapsed = now() - startTime;
      if (elapsed < MIN_SUBMIT_ANIMATION) {
        await new Promise((resolve) => setTimeout(resolve, MIN_SUBMIT_ANIMATION - elapsed));
      }

      // Set success state first, then stop submitting - no gap, no orange flash
      setSubmitStatus('success');
      setIsSubmitting(false);
      
      // Show toast notification with success state
      await new Promise((resolve) => setTimeout(resolve, 280));
      toast.success(
        result === 'exists' ? 'Already on the list! 🎉' : 'You\'re on the list! 🎉',
        {
          description: result === 'exists'
            ? `You're all set — we'll reach out when we launch.`
            : `We'll email you at launch!`,
          duration: 3000,
          onDismiss: () => {
            setEmail('');
            setSubmitStatus('idle');
          },
          onAutoClose: () => {
            setEmail('');
            setSubmitStatus('idle');
          },
        },
      );
      
      // Reset state when toast auto-closes (synced with duration)
      setTimeout(() => {
        setEmail('');
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      let description = 'Please try again later';
      if (error instanceof FirebaseError) {
        if (error.code === 'permission-denied') {
          description = 'Permission denied. Check Firestore rules for the waitlist collection.';
        } else if (error.code === 'unavailable') {
          description = 'Network unavailable. Check your internet connection.';
        } else if (error.message) {
          description = error.message;
        }
      }
      console.error('Failed to join waitlist', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      showErrorToast('Something went wrong', description);
    }
  };

  const nextScreen = () => {
    setCurrentScreen((prev) => (prev + 1) % screens.length);
  };

  const prevScreen = () => {
    setCurrentScreen((prev) => (prev - 1 + screens.length) % screens.length);
  };

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 8px 32px 0 rgba(123, 191, 114, 0.12)',
          },
        }}
      />
      <div
        className={`relative w-full h-screen ${
          isLanding
            ? 'overflow-y-auto sm:overflow-hidden snap-y snap-mandatory scroll-smooth sm:snap-none'
            : 'overflow-y-auto overflow-x-hidden'
        }`}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F0] via-[#FFF5E8] to-[#FFEDD5]">
          <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7BBF72] rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F6A43A] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#FFCC9E] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Paw Trail Animation */}
      <PawTrail />

      {/* Header */}
      <motion.header 
        initial={{ y: -16, opacity: 0, filter: 'blur(8px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
      >
        <button 
          onClick={() => setActiveSection('landing')}
          className={`flex items-center gap-2 hover:text-[#F6A43A] transition-colors ${activeSection === 'landing' ? 'text-[#F6A43A]' : 'text-[#24523B]/70'}`}
        >
          <span className="text-3xl">🐾</span>
          <span className="text-lg tracking-tight">PupCare</span>
        </button>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm text-[#24523B]/70">
          <button 
            onClick={() => setActiveSection('preview')}
            className={`hover:text-[#F6A43A] transition-colors ${activeSection === 'preview' ? 'text-[#F6A43A]' : ''}`}
          >
            Preview
          </button>
          <button 
            onClick={() => setActiveSection('founder')}
            className={`hover:text-[#F6A43A] transition-colors ${activeSection === 'founder' ? 'text-[#F6A43A]' : ''}`}
          >
            Founder
          </button>
        </nav>
      </motion.header>

      {/* Main content container */}
      <motion.div
        initial={false}
        animate={{ paddingTop: sectionPaddingTop }}
        transition={{ paddingTop: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
        className={`relative z-10 flex items-start ${sectionAlignment} justify-center px-4 sm:px-6 lg:px-8 snap-start sm:snap-none`}
        style={{ minHeight: 'calc(100vh - 4rem)', paddingTop: sectionPaddingTop }}
      >
        <AnimatePresence mode="wait" initial={false}>
          
          {/* Landing Page */}
          {activeSection === 'landing' && (
            <motion.div
              key="landing"
              initial={pageInitial}
              animate={pageAnimate}
              exit={pageExit}
              transition={pageTransition}
              className="w-full max-w-3xl mx-auto text-center flex flex-col justify-start sm:justify-center h-full px-4 pt-0 sm:pt-0"
              style={{ willChange: 'opacity, transform' }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="sm:hidden mb-4 text-[#24523B]/60 flex justify-center"
                style={{ fontSize: '0.75rem' }}
              >
                <span>© 2025 PupCare • mypupcare.com</span>
              </motion.div>

              <div className="space-y-5 sm:space-y-6 lg:space-y-7">
                {/* Coming Soon - Gradient Text */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <h1 className="text-[5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] tracking-tight leading-tight px-2 font-bold">
                    <span className="inline-block bg-gradient-to-r from-[#7BBF72] via-[#F6A43A] to-[#FFCC9E] bg-clip-text text-transparent">
                      Coming Soon
                    </span>
                  </h1>
                  
                  {/* Tagline - Dramatic Redesign */}
                  <motion.div 
                    className="relative max-w-2xl mx-auto px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7BBF72]/10 via-[#F6A43A]/10 to-[#FFCC9E]/10 blur-3xl rounded-full" />
                    
                    <div className="relative space-y-2 sm:space-y-3">
                      {/* Main dramatic text */}
                      <motion.p 
                        className="text-xl sm:text-2xl md:text-3xl tracking-tight leading-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        <span className="bg-gradient-to-r from-[#24523B] via-[#24523B]/90 to-[#24523B]/70 bg-clip-text text-transparent">
                          Every moment.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-[#7BBF72] via-[#F6A43A] to-[#FFCC9E] bg-clip-text text-transparent">
                          Every milestone.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-[#24523B]/70 via-[#24523B]/90 to-[#24523B] bg-clip-text text-transparent">
                          One beautiful story.
                        </span>
                      </motion.p>
                      
                      {/* Subtle hint text */}
                      <motion.p
                        className="text-xs sm:text-sm text-[#24523B]/40 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                      >
                        Your pup's journey, all in one place
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>

                <div className="flex justify-center gap-2 mt-3 sm:mt-4">
                  {screens.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentScreen(index)}
                      className={`h-2 w-2 rounded-full transition-all duration-500 ${
                        index === currentScreen
                          ? 'bg-[#F6A43A] w-4 shadow-[0_2px_12px_rgba(246,164,58,0.4)]'
                          : 'bg-[#24523B]/20 hover:bg-[#24523B]/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Email signup - Liquid Glass - Redesigned for Mobile */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-2 sm:space-y-3 max-w-xl mx-auto w-full"
                >
                  {/* Stacked layout optimized for mobile */}
                  <div className="space-y-2 w-full">
                    <motion.div 
                      className="relative"
                      animate={submitStatus === 'error' ? {
                        x: [0, -10, 10, -10, 10, 0],
                      } : {}}
                      transition={{ 
                        duration: 0.4,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                      }}
                    >
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setSubmitStatus('idle');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNotify();
                          }
                        }}
                        disabled={isSubmitting}
                        className={`w-full h-12 sm:h-14 px-4 sm:px-5 bg-white/25 backdrop-blur-xl border shadow-[0_8px_32px_0_rgba(123,191,114,0.12)] text-[#24523B] placeholder:text-[#24523B]/40 placeholder:text-sm sm:placeholder:text-base focus:bg-white/35 transition-all duration-300 rounded-full text-sm sm:text-base text-center ${
                          submitStatus === 'error' 
                            ? 'border-red-400 focus:border-red-500' 
                            : submitStatus === 'success'
                            ? 'border-[#7BBF72] focus:border-[#7BBF72]'
                            : 'border-white/40 focus:border-white/50'
                        }`}
                      />
                      {/* Status icons */}
                      <AnimatePresence mode="wait">
                        {submitStatus === 'success' && (
                          <motion.div
                            key="success-icon"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          >
                            <CheckCircle2 className="w-5 h-5 text-[#7BBF72]" />
                          </motion.div>
                        )}
                        {submitStatus === 'error' && (
                          <motion.div
                            key="error-icon"
                            initial={{ scale: 0, x: 0 }}
                            animate={{ 
                              scale: [0, 1.2, 1],
                              x: [0, -3, 3, -3, 3, 0]
                            }}
                            exit={{ scale: 0 }}
                            transition={{ 
                              scale: { duration: 0.3 },
                              x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          >
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.button
                      layout
                      onClick={handleNotify}
                      disabled={isSubmitting || submitStatus === 'success'}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className={`relative w-full h-12 sm:h-14 rounded-full text-sm sm:text-base flex items-center justify-center gap-2 overflow-hidden ${
                        isSubmitting
                          ? 'bg-[#24523B]/20 text-[#24523B]/50 cursor-not-allowed'
                          : submitStatus === 'success'
                          ? 'bg-[#24523B]/20 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#F6A43A] to-[#FFCC9E] text-white shadow-[0_8px_32px_0_rgba(246,164,58,0.35)] cursor-pointer active:brightness-95'
                      }`}
                    >
                      {/* Background transition overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: submitStatus === 'success' ? 1 : 0,
                        }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0 bg-gradient-to-r from-[#7BBF72] to-[#7BBF72]/80 shadow-[0_8px_32px_0_rgba(123,191,114,0.35)]"
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        <AnimatePresence mode="wait" initial={false}>
                          {isSubmitting ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ 
                                animate: { duration: 0.45, ease: "easeOut" },
                                exit: { duration: 0.55, ease: [0.4, 0, 0.2, 1] }
                              }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.div>
                              <motion.span
                                initial={{ opacity: 0.6 }}
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                              >
                                Joining...
                              </motion.span>
                            </motion.div>
                          ) : submitStatus === 'success' ? (
                            <motion.div
                              key="success"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                              >
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.div>
                              <span>You're in! 🎉</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="default"
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="flex items-center gap-2"
                            >
                              <span>Join the Waitlist</span>
                              <Bell className="w-4 h-4 sm:w-5 sm:h-5 animate-ring" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  </div>
                  <div className="w-full text-center">
                    <p className="text-xs sm:text-sm text-[#24523B]/50 flex items-center justify-center gap-2">
                      <span>•</span>
                      <span>✦ Be the first to know when we launch ✦</span>
                      <span>•</span>
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Preview Page */}
          {activeSection === 'preview' && (
            <motion.div
              key="preview"
              initial={pageInitial}
              animate={pageAnimate}
              exit={pageExit}
              transition={pageTransition}
              className="w-full h-full flex items-center justify-center px-4 sm:px-6"
              style={{ willChange: 'opacity, transform' }}
            >
              <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 sm:gap-5">
                
                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center space-y-0.5"
                >
                  <h2 className="text-2xl sm:text-3xl text-[#24523B] tracking-tight">
                    See PupCare in action
                  </h2>
                  <p className="text-xs sm:text-sm text-[#24523B]/60">
                    Tap to explore the features
                  </p>
                </motion.div>

                {/* Tab Switcher - Redesigned with Perfect Alignment */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative inline-grid grid-cols-2 bg-white/25 backdrop-blur-xl rounded-full p-1.5 shadow-[0_8px_32px_0_rgba(123,191,114,0.12)] border border-white/40"
                >
                  {/* Sliding highlight - perfectly matches button width */}
                  <motion.div
                    className="absolute top-1.5 bottom-1.5 left-1.5 right-1.5 bg-gradient-to-r from-[#F6A43A] to-[#FFCC9E] rounded-full shadow-[0_4px_20px_0_rgba(246,164,58,0.35)]"
                    style={{
                      width: 'calc(50% - 6px)',
                    }}
                    animate={{
                      transform: activeTab === 'iPhone' ? 'translateX(0%)' : 'translateX(100%)'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                  
                  <button
                    onClick={() => {
                      setActiveTab('iPhone');
                      setCurrentScreen(0);
                    }}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm transition-colors duration-300 ${
                      activeTab === 'iPhone'
                        ? 'text-white'
                        : 'text-[#24523B]/60 hover:text-[#24523B]'
                    }`}
                  >
                    iPhone
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveTab('Apple Watch');
                      setCurrentScreen(0);
                    }}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm transition-colors duration-300 ${
                      activeTab === 'Apple Watch'
                        ? 'text-white'
                        : 'text-[#24523B]/60 hover:text-[#24523B]'
                    }`}
                  >
                    Watch
                  </button>
                </motion.div>

                {/* Device Container with Navigation */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative flex items-center gap-3 sm:gap-4"
                >
                  {/* Previous Button - Liquid Glass */}
                  <motion.button
                    onClick={prevScreen}
                    whileTap={{ 
                      scale: 0.96
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(123,191,114,0.12)] border border-white/40 flex items-center justify-center cursor-pointer active:brightness-95 transition-[filter] duration-150"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#24523B]" />
                  </motion.button>

                  {/* Device Mockup Container - Fixed size to prevent shifting */}
                  <div className="relative w-44 sm:w-48 h-[22rem] sm:h-[24rem] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {activeTab === 'iPhone' ? (
                        <motion.div
                          key="iphone"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute w-44 sm:w-48 h-[22rem] sm:h-[24rem] bg-[#24523B] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-1.5"
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#24523B] rounded-b-2xl z-10" />
                          
                          {/* Screen */}
                          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#FFF9F0] to-[#FFCC9E]/30 sm:rounded-[2rem]">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentScreen}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                              >
                                <IPhoneScreen screenIndex={currentScreen} />
                              </motion.div>
                            </AnimatePresence>

                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="watch"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute w-36 sm:w-40 h-36 sm:h-40 bg-[#24523B] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-2"
                        >
                          {/* Watch Screen */}
                          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#FFF9F0] to-[#FFCC9E]/30 sm:rounded-[2rem]">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentScreen}
                                initial={{ opacity: 0, scale: 0.94, y: 12, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.94, y: -12, filter: 'blur(10px)' }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 p-1 will-change-transform"
                              >
                                <AppleWatchScreen screenIndex={currentScreen} />
                              </motion.div>
                            </AnimatePresence>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Next Button - Liquid Glass */}
                  <motion.button
                    onClick={nextScreen}
                    whileTap={{ 
                      scale: 0.96
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(123,191,114,0.12)] border border-white/40 flex items-center justify-center cursor-pointer active:brightness-95 transition-[filter] duration-150"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#24523B]" />
                  </motion.button>
                </motion.div>



                {/* Feature Tag - Liquid Glass */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex justify-center w-full px-4"
                >
                  {/* Static background shell - matches toggle exactly - FIXED WIDTH */}
                  <div className="inline-flex items-center justify-center bg-white/25 backdrop-blur-xl rounded-full shadow-[0_8px_32px_0_rgba(123,191,114,0.12)] border border-white/40 px-4 sm:px-6 py-2 sm:py-2.5 w-[280px] sm:w-[320px] min-h-[52px] sm:min-h-[56px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentScreen}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center gap-3 sm:gap-4"
                      >
                        {(() => {
                          const benefit = benefits[currentScreen];
                          const Icon = benefit.icon;
                          return (
                            <>
                              <span className="text-[#F6A43A] text-sm sm:text-base font-semibold w-7 text-center">
                                {currentScreen + 1}.
                              </span>
                              <p className="text-[#24523B] text-xs sm:text-sm text-center w-[170px] sm:w-[190px]">
                                {benefit.text}
                              </p>
                              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#7BBF72]" />
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}

          {/* Founder Page */}
          {activeSection === 'founder' && (
            <motion.div
              key="founder"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6">
                
                {/* Dog Image with Pet Interaction */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <PetButton 
                      imageSrc={hanoImage}
                      imageAlt="Happy dog"
                  />
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="max-w-xl space-y-4 sm:space-y-5"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#24523B] tracking-tight flex items-center justify-center gap-2 sm:gap-3">
                      <span>Built with</span>
                      <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-500 fill-red-500" />
                    </h2>
                    <p className="text-base sm:text-lg text-[#F6A43A]">for dog parents, by a dog parent</p>
                  </div>

                  <div className="space-y-3 text-[#24523B]/70 text-xs sm:text-sm max-w-lg mx-auto founder-copy">
                    <p className="leading-relaxed">
                      This is Hano, my pup and my best friend. She's the reason I created PupCare.
                    </p>
                    <p className="leading-relaxed">
                      All our trips, walks, and little moments -- I wanted a simple way to save them all in one place, while also keeping track of her diet, daily health notes, and vet visits.
                    </p>
                    <p className="leading-relaxed">
                      And... PupCare brings everything together in one neatly organized space, designed to make dog parenting easier.
                    </p>
                  </div>

                  {/* Buy Me a Treat Button - Liquid Glass */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="pt-1"
                  >
                    <motion.button 
                      whileTap={{ 
                        scale: 0.96
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={() => window.open('https://buy.stripe.com/9B628r3Zc4rX3ds1bmfrW00', '_blank', 'noopener,noreferrer')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/25 backdrop-blur-xl rounded-full shadow-[0_8px_32px_0_rgba(123,191,114,0.12)] border border-white/40 text-[#24523B] cursor-pointer active:brightness-95 transition-[filter] duration-150"
                    >
                      <Bone className="w-4 h-4 sm:w-5 sm:h-5 text-[#F6A43A]" />
                      <span className="text-xs sm:text-sm">Buy me a treat</span>
                    </motion.button>
                  </motion.div>
                </motion.div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-15deg); }
          20%, 40% { transform: rotate(15deg); }
          50% { transform: rotate(0deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        .animate-ring {
          animation: ring 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </>
  );
}
