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
        <img
          src={media.imageUrl}
          alt={exerciseName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2">
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

        <a
          href={`https://www.youtube.com/watch?v=${media.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 flex items-center gap-1 transition text-[11px] font-bold"
        >
          <Play className="w-3 h-3 fill-red-400" />
          <span>YouTube</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        {showVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${media.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            title={media.videoTitle}
            className="w-full h-full border-0 select-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={media.imageUrl}
              alt={exerciseName}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
              <button
                onClick={() => setShowVideo(true)}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'hi' ? 'वीडियो चलाएं' : 'Play Video'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
