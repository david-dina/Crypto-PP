"use client"
import Image from "next/image";
import { useState } from "react";

const ArtistComponent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredArtist, setIsHoveredArtist] = useState(false);

  return (
    <div
      style={{
        backgroundColor: isHovered ? "#101010" : "transparent",
        color: "white",
        padding: "15px",
        borderRadius: "16px",
        margin: "15px",
        display: "flex",
        flexDirection: "column",
        width: "180px",
        alignItems: "center",
        transition: "background-color 0.3s ease-in-out",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "relative",
          width: "115px",
          height: "115px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <a href="#">
          <Image
            src="https://i.scdn.co/image/ab6761610000e5eb96b3ab10e89bad078d125c3a"
            alt="Artist Image"
            width={115}
            height={115}
            style={{
              objectFit: "cover",
            }}
          />
        </a>
        </div>
        <div
          className="bg-primary"
          style={{
            position: "absolute",
            top: "90px",
            right: "28px",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "20px",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
            zIndex: 10,
          }}
        >
          <span style={{ transform: "translate(1px, 1px)" }}>▶</span>
        </div>
      <div style={{ height: "8px" }} />
      <a href="#" style={{ display: "flex", alignSelf: "flex-start" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            textAlign: "left",
            textDecoration: isHoveredArtist ? "underline" : "none",
            transition: "text-decoration 0.3s ease-in-out",
            margin: "0px",
          }}
          onMouseEnter={() => setIsHoveredArtist(true)}
          onMouseLeave={() => setIsHoveredArtist(false)}
        >
          DDot
        </h3>
      </a>
      <div style={{ height: "6px" }} />
      <h3
        style={{
          fontSize: "0.85rem",
          fontWeight: "semibold",
          textAlign: "left",
          color: "#b3b3b3",
          alignSelf: "flex-start",
          cursor: "default",
          margin: "0px",
        }}
      >
        Artist
      </h3>
    </div>
  );
};

export default ArtistComponent;
