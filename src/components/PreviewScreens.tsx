import { motion, AnimatePresence } from 'motion/react';
import { useIsMobile } from './ui/use-mobile';
import watch1 from '../watch-1.png';
import watch2 from '../watch-2.png';
import watch3 from '../watch-3.png';
import watch4 from '../watch-4.png';
import watch5 from '../watch-5.png';
import mobile1 from '../mobile-1.png';
import mobile2 from '../mobile-2.png';
import mobile3 from '../mobile-3.png';
import mobile4 from '../mobile-4.png';
import mobile5 from '../mobile-5.png';

interface ScreenProps {
  screenIndex: number;
}

interface ScreenWithDirection extends ScreenProps {
  direction?: ScreenDirection;
}

interface IPhoneScreenProps extends ScreenWithDirection {}

interface MobileScreenProps {
  isCompact: boolean;
}

type ScreenDirection = 1 | -1;

/* -------------------------------------------------------------------------- */
/*                                iPhone Screens                              */
/* -------------------------------------------------------------------------- */

export function IPhoneScreen({ screenIndex, direction = 1 }: IPhoneScreenProps) {
  const isCompact = useIsMobile();

  const screens = [
    { key: 'walk', Component: WalkLoggingScreen },
    { key: 'streak', Component: StreakRewardsScreen },
    { key: 'health', Component: HealthNotesScreen },
    { key: 'map', Component: MapFinderScreen },
    { key: 'activity', Component: ActivityScreen },
  ];

  const fallbackScreen = screens[0];
  const activeScreen = screens[screenIndex] ?? fallbackScreen;
  const ScreenComponent = activeScreen.Component;

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={activeScreen.key}
        custom={direction}
        variants={mobileShellVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="relative h-full w-full will-change-transform rounded-[32px]"
        style={{ perspective: '1400px' }}
      >
        <motion.div
          aria-hidden
          variants={mobileAmbientVariants}
          className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/40 via-white/10 to-transparent blur-3xl"
        />

        <div className="relative h-full w-full overflow-hidden rounded-[32px]">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={`${activeScreen.key}-content`}
              custom={direction}
              variants={mobileContentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative h-full w-full"
            >
              <ScreenComponent isCompact={isCompact} />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-[4%] rounded-[28px] border border-white/35 shadow-[inset_0_0_30px_rgba(255,255,255,0.2)]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 0.7, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`${activeScreen.key}-glare`}
              custom={direction}
              variants={mobileGlareVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
            >
              <div className="absolute -left-1/3 top-0 h-full w-1/2 bg-white/30 blur-3xl" />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const mobileTransition = { type: 'spring', stiffness: 210, damping: 30, mass: 0.85 };
const exitTransition = { duration: 0.32, ease: [0.4, 0, 0.2, 1] };
const watchTransition = { type: 'spring', stiffness: 560, damping: 28, mass: 0.74 };
const mobileShellSpring = { type: 'spring', stiffness: 360, damping: 34, mass: 0.92 };
const mobileContentSpring = { type: 'spring', stiffness: 520, damping: 40, mass: 0.88 };

const mobileShellVariants = {
  enter: (direction: ScreenDirection) => ({
    opacity: 0,
    x: direction === 1 ? 32 : -32,
    y: 22,
    rotateX: -6,
    rotateY: direction === 1 ? 8 : -8,
    scale: 0.94,
    filter: 'brightness(0.85) blur(10px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    filter: 'brightness(1) blur(0px)',
    transition: mobileShellSpring,
  },
  exit: (direction: ScreenDirection) => ({
    opacity: 0,
    x: direction === 1 ? -28 : 28,
    y: -18,
    rotateX: 5,
    rotateY: direction === 1 ? -7 : 7,
    scale: 0.95,
    filter: 'brightness(0.9) blur(12px)',
    transition: { duration: 0.42, ease: [0.32, 0.01, 0.22, 1] },
  }),
};

const mobileContentVariants = {
  enter: (direction: ScreenDirection) => ({
    opacity: 0,
    x: direction === 1 ? 18 : -18,
    scale: 0.96,
    rotateX: -2,
    filter: 'blur(6px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: mobileContentSpring,
  },
  exit: (direction: ScreenDirection) => ({
    opacity: 0,
    x: direction === 1 ? -16 : 16,
    scale: 0.97,
    rotateX: 1,
    filter: 'blur(6px)',
    transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
  }),
};

const mobileAmbientVariants = {
  enter: { opacity: 0, scale: 0.85 },
  center: { opacity: 0.9, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.28 } },
};

const mobileGlareVariants = {
  enter: (direction: ScreenDirection) => ({
    opacity: 0,
    x: direction === 1 ? -120 : 120,
  }),
  center: (direction: ScreenDirection) => ({
    opacity: [0, 0.5, 0],
    x: direction === 1 ? 120 : -120,
    transition: { duration: 0.9, ease: [0.42, 0, 0.2, 1] },
  }),
  exit: { opacity: 0 },
};

const mobileMotion = {
  initial: { opacity: 0, scale: 0.97, y: 18, rotateX: -3 },
  animate: { opacity: 1, scale: 1.02, y: 0, rotateX: 0 },
  exit: { opacity: 0, scale: 0.97, y: -14, rotateX: 3, transition: exitTransition },
};

const emphasisMotion = {
  initial: { opacity: 0, scale: 0.96, y: 16, rotateX: -4 },
  animate: { opacity: 1, scale: 1.04, y: 0, rotateX: 0 },
  exit: { opacity: 0, scale: 0.96, y: -14, rotateX: 4, transition: exitTransition },
};

const mapMotion = {
  initial: { opacity: 0, scale: 0.95, y: 14, rotateX: -2 },
  animate: { opacity: 1, scale: 1.03, y: 0, rotateX: 0 },
  exit: { opacity: 0, scale: 0.94, y: -14, rotateX: 2, transition: exitTransition },
};

function WalkLoggingScreen({ isCompact }: MobileScreenProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#fdf3e3] via-[#f7e7d0] to-[#edd9bb] p-3 shadow-[0_18px_32px_rgba(34,70,51,0.12)]">
      <motion.img
        key="mobile-one"
        initial={mobileMotion.initial}
        animate={isCompact ? { ...mobileMotion.animate, scale: 1.34 } : { ...mobileMotion.animate, scale: 1.26 }}
        exit={mobileMotion.exit}
        transition={mobileTransition}
        src={mobile1}
        alt="PupCare walks overview"
        className="h-full w-full rounded-[26px] object-cover shadow-[0_16px_32px_rgba(27,52,38,0.18)]"
        loading="lazy"
      />
    </div>
  );
}

function StreakRewardsScreen({ isCompact }: MobileScreenProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#f5e9ca] via-[#eddcb2] to-[#dbbf93] p-3 shadow-[0_18px_32px_rgba(36,70,49,0.18)]">
      <motion.img
        key="mobile-two"
        initial={emphasisMotion.initial}
        animate={isCompact ? { ...emphasisMotion.animate, scale: 1.24 } : { ...emphasisMotion.animate, scale: 1.16 }}
        exit={emphasisMotion.exit}
        transition={mobileTransition}
        src={mobile2}
        alt="PupCare streaks overview"
        className="h-full w-full rounded-[26px] object-cover shadow-[0_18px_36px_rgba(40,60,50,0.2)]"
        loading="lazy"
      />
    </div>
  );
}

function HealthNotesScreen({ isCompact }: MobileScreenProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#f4ead0] via-[#ebdfbc] to-[#d8c49d] p-3 shadow-[0_18px_32px_rgba(33,69,48,0.16)]">
      <motion.img
        key="mobile-three"
        initial={emphasisMotion.initial}
        animate={isCompact ? { ...emphasisMotion.animate, scale: 1.28 } : { ...emphasisMotion.animate, scale: 1.16 }}
        exit={emphasisMotion.exit}
        transition={mobileTransition}
        src={mobile3}
        alt="PupCare health notes preview"
        className="h-full w-full rounded-[26px] object-cover shadow-[0_20px_36px_rgba(30,50,35,0.2)]"
        loading="lazy"
      />
    </div>
  );
}

function MapFinderScreen({ isCompact }: MobileScreenProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[36px] border border-white/35 bg-gradient-to-br from-[#fdf3e3] via-[#f7e7d0] to-[#edd9bb] p-3 shadow-[0_18px_32px_rgba(34,70,51,0.15)]">
      <motion.img
        key="mobile-map"
        initial={mapMotion.initial}
        animate={isCompact ? { ...mapMotion.animate, scale: 1.42 } : { ...mapMotion.animate, scale: 1.3 }}
        exit={mapMotion.exit}
        transition={mobileTransition}
        src={mobile4}
        alt="PupCare map preview"
        className="h-full w-full rounded-[28px] object-cover shadow-[0_20px_40px_rgba(38,60,90,0.2)]"
        loading="lazy"
      />
    </div>
  );
}

function ActivityScreen({ isCompact }: MobileScreenProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#FFF9F0] to-[#FFCC9E]/20 p-3 shadow-[0_18px_32px_rgba(38,76,55,0.16)]">
      <motion.img
        key="mobile-five"
        initial={emphasisMotion.initial}
        animate={
          isCompact
            ? { ...emphasisMotion.animate, scale: 1.26 }
            : { ...emphasisMotion.animate, scale: 1.18 }
        }
        exit={emphasisMotion.exit}
        transition={mobileTransition}
        src={mobile5}
        alt="PupCare activity summary"
        className="h-full w-full rounded-[26px] object-cover shadow-[0_18px_32px_rgba(35,70,51,0.2)]"
        loading="lazy"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Apple Watch Views                            */
/* -------------------------------------------------------------------------- */

export function AppleWatchScreen({ screenIndex, direction = 1 }: ScreenWithDirection) {
  const isCompact = useIsMobile();
  const watchVariants = {
    enter: {
      opacity: 0,
      scale: isCompact ? 0.92 : 0.96,
      y: isCompact ? 16 : 8,
      x: direction === 1 ? 22 : -22,
      rotateX: -6,
      rotateY: direction === 1 ? 6 : -6,
      filter: 'blur(12px)',
    },
    center: {
      opacity: 1,
      scale: isCompact ? 1.04 : 1,
      y: 0,
      x: 0,
      rotateX: 0,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: watchTransition,
    },
    exit: {
      opacity: 0,
      scale: isCompact ? 0.94 : 0.9,
      y: isCompact ? -16 : -10,
      x: direction === 1 ? -18 : 18,
      rotateX: 5,
      rotateY: direction === 1 ? -4 : 4,
      filter: 'blur(10px)',
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const screens = [
    <QuickWalkScreen key="walk" />,
    <StreakDisplayScreen key="streak" />,
    <QuickHealthScreen key="health" />,
    <MapViewScreen key="map" />,
    <ActivitySummaryScreen key="activity" />,
  ];

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={screenIndex}
        custom={direction}
        variants={watchVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="h-full w-full"
        style={{ perspective: '1200px' }}
      >
        <div className="relative h-full w-full">
          <div className="pointer-events-none absolute inset-0 rounded-[25%] bg-gradient-to-br from-white/30 to-transparent blur-2xl" />
          {screens[screenIndex] || screens[0]}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function QuickWalkScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-0">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch1}
          alt="PupCare Apple Watch preview"
          className="h-full w-full rounded-[18%] object-cover"
          style={{ transform: 'scale(1.03) translateX(1%)' }}
          loading="lazy"
        />
      </div>
    </div>
  );
}

function StreakDisplayScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-0">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch2}
          alt="PupCare Apple Watch streak preview"
          className="h-full w-full rounded-[18%] object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function QuickHealthScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-0">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch3}
          alt="PupCare Apple Watch health preview"
          className="h-full w-full rounded-[18%] object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function MapViewScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-0">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch4}
          alt="PupCare Apple Watch map preview"
          className="h-full w-full rounded-[18%] object-cover"
          style={{ transform: 'scale(1.55)', transformOrigin: 'center' }}
          loading="lazy"
        />
      </div>
    </div>
  );
}

function ActivitySummaryScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-0">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch5}
          alt="PupCare Apple Watch activity preview"
          className="h-full w-full rounded-[18%] object-cover"
          style={{ transform: 'scale(1.06)' }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
