"use client"
import React, { useState, useRef, useEffect } from 'react';

interface Song {
  title: string;
  name: string;
  source: string;
  image: string;
}

interface MusicPlayerProps {
  songs: Song[];
  initialSongIndex?: number;
}

const SongCardSwiper: React.FC<MusicPlayerProps> = ({ songs, initialSongIndex = 0 }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = currentSong.source;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    // Reset progress bar when song changes
    if (progressRef.current) {
      progressRef.current.value = '0';
    }
  }, [currentSongIndex]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = () => {
    setCurrentSongIndex((currentSongIndex + 1) % songs.length);
  };

  const handleBackward = () => {
    setCurrentSongIndex((currentSongIndex - 1 + songs.length) % songs.length);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  const updateProgress = () => {
    if (audioRef.current && progressRef.current) {
      progressRef.current.value = audioRef.current.currentTime.toString();
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && progressRef.current) {
      progressRef.current.max = audioRef.current.duration.toString();
    }
  };

  // Touch and Mouse Event Handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    setDragStartX(getClientX(e));
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current || dragStartX === null) return;

    const currentX = getClientX(e);
    const deltaX = currentX - dragStartX;
    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    if (dragOffset > 50) {
      // Swipe right to previous song
      handleBackward();
    } else if (dragOffset < -50) {
      // Swipe left to next song
      handleForward();
    }
    setDragOffset(0);
    setDragStartX(null);
  };

  const getClientX = (e: React.TouchEvent | React.MouseEvent): number => {
    return 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Album Cover Carousel */}
      <div
        className="relative w-full max-w-md overflow-hidden"
        ref={carouselRef}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={(e) => {
          if (isDragging.current) {
            handleDragMove(e);
          }
        }}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => {
          if (isDragging.current) {
            handleDragEnd();
          }
        }}
      >
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(calc(-${currentSongIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {songs.map((song, index) => (
            <div
              key={index}
              className="min-w-full flex-shrink-0 flex justify-center items-center"
            >
              <div className="w-full max-w-md aspect-square overflow-hidden">
                <img
                  src={song.image}
                  alt={song.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full"
          onClick={handleBackward}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.707 14.707a1 1 0 01-1.414 0L7 10.414 11.293 6.12a1 1 0 011.414 1.415L9.414 10l3.293 3.293a1 1 0 010 1.414z" />
          </svg>
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full"
          onClick={handleForward}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414L12.414 10l-3.707 3.707a1 1 0 01-1.414 0z" />
          </svg>
        </button>
      </div>

      {/* Music Player Controls */}
      <div className="music-player flex flex-col items-center text-white w-full max-w-md p-4">
        <h1 className="text-xl font-semibold mt-4 text-center">{currentSong.title}</h1>
        <p className="text-base opacity-60 text-center">{currentSong.name}</p>

        <audio
          ref={audioRef}
          onTimeUpdate={updateProgress}
          onLoadedMetadata={handleLoadedMetadata}
        />

        <input
          type="range"
          ref={progressRef}
          defaultValue="0"
          onChange={handleProgressChange}
          className="w-full mt-8 mb-6"
        />

        <div className="controls flex justify-center items-center">
          <button className="backward mx-5" onClick={handleBackward}>
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11 19V5l-7 7 7 7zM13 5v14l7-7-7-7z" />
            </svg>
          </button>
          <button className="play-pause-btn mx-5" onClick={togglePlayPause}>
            {isPlaying ? (
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zM14 5v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
          <button className="forward mx-5" onClick={handleForward}>
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13 5v14l7-7-7-7zM11 19V5l-7 7 7 7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCardSwiper;
