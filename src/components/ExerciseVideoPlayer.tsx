import React, { useState } from 'react';
import { Play, Video, Image as ImageIcon, ExternalLink, Maximize2 } from 'lucide-react';
import { MuscleGroup, AppLanguage } from '../types';
import { getExerciseMedia } from '../data/exerciseMedia';

interface ExerciseVideoPlayerProps {
  exerciseId: string;
  targetMuscle: MuscleGroup;
  exerciseName: string;
  isCompact?: boolean;
  autoPlayVideo?: boolean;
  language?: AppLanguage;
}

export const ExerciseVideoPlayer: React.FC<ExerciseVideoPlayerProps> = ({
  exerciseId,
  targetMuscle,
  exerciseName,
  isCompact = false,
  autoPlayVideo = false,
  language = 'en'
}) => {
  const media = getExerciseMedia(exerciseId, targetMuscle);
  const [showVideo, setShowVideo] = useState<boolean>(autoPlayVideo);

  if (isCompact) {
    return (
      <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden rounded-t-2xl group">
        {/* Real HD Form Photograph */}
        <img
          src={media.imageUrl}
          alt={exerciseName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Watch Real Video Badge Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-bold text-slate-200 border border-slate-700/60 backdrop-blur-xs flex items-center gap-1">
          <Video className="w-3 h-3 text-red-400" />
          <span>{language === 'hi' ? 'असली वीडियो' : 'Real Video Guide'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
      {/* View Switcher Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3.5 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            {language === 'hi' ? 'असली वीडियो ट्यूटोरियल' : 'Real Video Demonstration'}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setShowVideo(true)}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition flex items-center gap-1.5 text-xs ${
              showVideo
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'वीडियो' : 'Video'}</span>
          </button>

          <button
            onClick={() => setShowVideo(false)}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition flex items-center gap-1.5 text-xs ${
              !showVideo
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'फोटो' : 'Photo'}</span>
          </button>
        </div>
      </div>

      {/* Main Media Container */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        {showVideo ? (
          <div className="relative w-full h-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${media.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
              title={media.videoTitle}
              className="w-full h-full border-0 select-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={media.imageUrl}
              alt={exerciseName}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
              <button
                onClick={() => setShowVideo(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{language === 'hi' ? 'असली वीडियो चलाएं' : 'Play Real Video Demonstration'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media caption bar & 1-tap YouTube launcher */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-2 flex-wrap">
        <span className="line-clamp-1 font-medium text-slate-300">{media.videoTitle}</span>
        
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://www.youtube.com/watch?v=${media.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-500/40 text-red-400 hover:text-red-300 flex items-center gap-1.5 transition text-[11px] font-bold"
            title="Open in YouTube App"
          >
            <Play className="w-3 h-3 fill-red-400" />
            <span>{language === 'hi' ? 'यूट्यूब पर देखें' : 'Watch on YouTube'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
