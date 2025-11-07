import { motion } from 'motion/react';
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

/* -------------------------------------------------------------------------- */
/*                                iPhone Screens                              */
/* -------------------------------------------------------------------------- */

export function IPhoneScreen({ screenIndex }: ScreenProps) {
  const screens = [
    <WalkLoggingScreen key="walk" />,
    <StreakRewardsScreen key="streak" />,
    <HealthNotesScreen key="health" />,
    <MapFinderScreen key="map" />,
    <ActivityScreen key="activity" />,
  ];

  return screens[screenIndex] || screens[0];
}

const mobileTransition = { type: 'spring', stiffness: 190, damping: 28, mass: 0.8 };
const exitTransition = { duration: 0.32, ease: [0.4, 0, 0.2, 1] };

const mobileMotion = {
  initial: { opacity: 0, scale: 0.92, y: 22, rotateX: -4 },
  animate: { opacity: 1, scale: 1.16, y: 4, rotateX: 0 },
  exit: { opacity: 0, scale: 0.96, y: -16, rotateX: 4, transition: exitTransition },
};

const emphasisMotion = {
  initial: { opacity: 0, scale: 0.96, y: 24, rotateX: -5 },
  animate: { opacity: 1, scale: 1.15, y: 6, rotateX: 0 },
  exit: { opacity: 0, scale: 0.96, y: -18, rotateX: 5, transition: exitTransition },
};

const mapMotion = {
  initial: { opacity: 0, scale: 0.92, y: 18, rotateX: -3 },
  animate: { opacity: 1, scale: 1.18, y: 0, rotateX: 0 },
  exit: { opacity: 0, scale: 0.96, y: -18, rotateX: 3, transition: exitTransition },
};

function WalkLoggingScreen() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#fdf3e3] via-[#f7e7d0] to-[#edd9bb] p-3 shadow-[0_18px_32px_rgba(34,70,51,0.12)]">
      <motion.img
        key="mobile-one"
        initial={mobileMotion.initial}
        animate={mobileMotion.animate}
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

function StreakRewardsScreen() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#f5e9ca] via-[#eddcb2] to-[#dbbf93] p-3 shadow-[0_18px_32px_rgba(36,70,49,0.18)]">
      <motion.img
        key="mobile-two"
        initial={emphasisMotion.initial}
        animate={emphasisMotion.animate}
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

function HealthNotesScreen() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#f4ead0] via-[#ebdfbc] to-[#d8c49d] p-3 shadow-[0_18px_32px_rgba(33,69,48,0.16)]">
      <motion.img
        key="mobile-three"
        initial={emphasisMotion.initial}
        animate={emphasisMotion.animate}
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

function MapFinderScreen() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[36px] border border-white/35 bg-gradient-to-br from-[#fdf3e3] via-[#f7e7d0] to-[#edd9bb] p-3 shadow-[0_18px_32px_rgba(34,70,51,0.15)]">
      <motion.img
        key="mobile-map"
        initial={mapMotion.initial}
        animate={mapMotion.animate}
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

function ActivityScreen() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/35 bg-gradient-to-br from-[#FFF9F0] to-[#FFCC9E]/20 p-3 shadow-[0_18px_32px_rgba(38,76,55,0.16)]">
      <motion.img
        key="mobile-five"
        initial={emphasisMotion.initial}
        animate={{ ...emphasisMotion.animate, scale: 1.18 }}
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

export function AppleWatchScreen({ screenIndex }: ScreenProps) {
  const screens = [
    <QuickWalkScreen key="walk" />,
    <StreakDisplayScreen key="streak" />,
    <QuickHealthScreen key="health" />,
    <MapViewScreen key="map" />,
    <ActivitySummaryScreen key="activity" />,
  ];

  return screens[screenIndex] || screens[0];
}

function QuickWalkScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-1">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch1}
          alt="PupCare Apple Watch preview"
          className="h-[75%] w-[75%] rounded-[18%] object-cover translate-x-[12%]"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function StreakDisplayScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-1">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch2}
          alt="PupCare Apple Watch streak preview"
          className="h-[80%] w-[80%] rounded-[18%] object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function QuickHealthScreen() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20%] bg-gradient-to-br from-[#F4FAFF] via-[#E4F2FF] to-[#CFE8FF] border border-white/60 shadow-[0_12px_30px_rgba(68,123,187,0.18)] p-2">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={watch3}
          alt="PupCare Apple Watch health preview"
          className="h-[70%] w-[70%] rounded-[18%] object-cover"
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
          style={{ transform: 'scale(1.45)', transformOrigin: 'center' }}
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
          style={{ transform: 'scale(0.9)', transformOrigin: 'center' }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
