import { FC, useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";
import { motion, useAnimation, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import PlayIcon from "../atoms/icons/PlayIcon";
import { useDispatch } from "react-redux";
import { openVideoModal, setCurrentVideo, setIsModalOpen } from "@/redux/features/globalSlice";
import Typography from "../text/Typography";
import Button from "../Button/Button";

export type VideoData = {
  label: string;
  link: string;
  isDefault?: boolean;
};

interface VideoSectionProps {
  data: VideoData[];
}



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};


const buttonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2 } },
};



const VideoSection: FC<VideoSectionProps> = ({ data }) => {
  const scrollContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollContainerRef });
  const scale = useTransform(scrollYProgress, [0, 1], ['0%', "3000%"]);
  const x = useTransform(scrollYProgress, [0, 1], ['50%', "-500%"]);
  const xBackground = useTransform(scrollYProgress, [0, 1], ['10%', "-10%"]);
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const dispatch = useDispatch();
  const [isVideoSectionReady, setIsVideoSectionReady] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isExiting) {
      controls.start({ x: '-2000%', transition: { duration: 1 } });
    } else {
      controls.start({ x: x.get(), transition: { duration: 1 } });
    }
  }, [isExiting, controls, x]);

  useMotionValueEvent(percentage, "change", (value) => {
    setIsVideoSectionReady(value > 40);
    setIsExiting(value > 99);
  });

  const handleClick = (link: string) => {
    dispatch(openVideoModal(link));
  };

  return (
    <>
      <motion.div ref={scrollContainerRef} className={twJoin([
        'h-[350vh] overflow-x-hidden sm:overflow-x-visible my-48 hidden lg:block',
      ])}>
        <motion.div className="sticky left-0 top-0 flex h-[100vh] w-[100vw] items-center justify-center">
          <motion.div animate={{ opacity: isExiting ? '0%' : '100%', transition: { duration: 0.6 } }} style={{ scale, x, transformOrigin: 'left', }} className={twJoin([
            isExiting ? 'pointer-events-none' : 'pointer-events-auto',
          ])}>
            <PlayIcon className="" size="50%" />
          </motion.div>
          <motion.div style={{ x: xBackground }} className="absolute top-0 h-full w-full bg-[url('/mediaButtonScattered.svg')] bg-cover bg-no-repeat" />
          {isVideoSectionReady &&
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className={twJoin(['w-full h-full absolute z-10 flex flex-col gap-20 items-center justify-center'])}
            >
              {data.map((item) => (
                <motion.button
                  key={item.label}
                  variants={buttonVariants}
                  animate={{ opacity: isExiting ? '0%' : '100%', transition: { duration: 0.6 } }}
                  onClick={() => handleClick(item.link)}
                  className={twJoin([
                    'group relative w-dvw',
                    isExiting ? 'pointer-events-none' : 'pointer-events-auto',
                  ])}
                >
                  <h4 className="relative z-50 p-5 text-6xl text-primary transition duration-500 group-hover:text-white">
                    {item.label}
                  </h4>
                  <div className={twJoin([
                    'h-full bg-gradient-to-r  from-secondary to-accent -translate-x-[100%] group-hover:translate-x-[0%]  -translate-y-[100%] transition duration-500 -z-50',
                  ])} />
                </motion.button>
              ))}
            </motion.div>
          }
        </motion.div>
      </motion.div >
      <div className={twJoin(['block lg:hidden'])}>
        <Typography className="text-center" variant="h2">Videos</Typography>
        <div className="flex flex-col items-center justify-center gap-8">
          {data.map((item) =>
            <Button key={item.label} onClick={() => handleClick(item.link)}>
              {item.label}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoSection;
