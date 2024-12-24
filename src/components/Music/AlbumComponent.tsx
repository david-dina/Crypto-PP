"use client"
import { useState } from "react";
import Image from "next/image";

const AlbumComponent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredArtist, setIsHoveredArtist] = useState(false);
  const [isHoveredTitle, setIsHoveredTitle] = useState(false);
  const artist = 'Music.AI'

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={{
        backgroundColor: 'transparent',
        color: 'white',
        padding: '15px',
        paddingRight:'5px',
        borderRadius: '16px',
        margin: '15px',
        display: 'flex',
        flexDirection: 'column',
        width: '220px',
        transition: 'background-color 0.3s ease-in-out',
        position: 'relative',
        ...(isHovered && {
          backgroundColor: '#101010',
        }),
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div style={{ position: 'relative', width: '190px', alignSelf: 'flex-start' }}>
        <a href="#">
          <Image
            src="https://ubdclxojnftwcnowsgfr.supabase.co/storage/v1/object/public/images/cover_image/clo5qucjb001lpn0pupa2o5jh-66f5b373-02f4-4fe8-8fdb-99bd95ea2dc8-1698237771414-415bb8e7-1507-4deb-9946-bd569bc9121a-2F5491E8-C43F-464B-9098-8FC2E3611265.jpg"
            alt="Album Cover"
            width={190}
            height={185}
            style={{ display: 'block', borderRadius: '8px' }}
          />
        </a>
        <div
         className="bg-primary"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '23px',
            opacity: isHovered ? 1 : 0, 
            transform: isHovered ? 'translateY(0)' : 'translateY(15px)', 
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          }}
        >
          <span style={{ transform: 'translate(1px, 1px)' }}>▶</span>
        </div>
      </div>
      <div style={{ height: '10px' }} />
      <a href="#" style={{ alignSelf: 'flex-start' }}>
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textAlign: 'left',
            textDecoration: isHoveredTitle ? 'underline' : 'none',
            transition: 'text-decoration 0.3s ease-in-out',
            margin: '0px',
          }}
          onMouseEnter={() => setIsHoveredTitle(true)}
          onMouseLeave={() => setIsHoveredTitle(false)}
        >
          Love Lockdown
        </h3>
      </a>
      <div style={{ height: '6px' }} />
      <a href={`/profile/${artist}`} style={{ alignSelf: 'flex-start' }}>
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 'semibold',
            textAlign: 'left',
            color: '#b3b3b3',
            textDecoration: isHoveredArtist ? 'underline' : 'none',
            transition: 'text-decoration 0.3s ease-in-out',
            margin: '0px',
          }}
          onMouseEnter={() => setIsHoveredArtist(true)}
          onMouseLeave={() => setIsHoveredArtist(false)}
        >
          {artist}
        </h3>
      </a>
    </div>
  );
}

export default AlbumComponent;

