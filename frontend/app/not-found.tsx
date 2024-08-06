"use client";
import React, { useEffect, useState } from "react";
import "./notFound.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const [stars, setStars] = useState<
    { id: number; left: number; top: number }[]
  >([]);

  useEffect(() => {
    const createStars = () => {
      const newStars = [];
      for (let i = 0; i < 300; i++) {
        const left = Math.random() * window.innerWidth;
        const top = Math.random() * window.innerHeight;
        newStars.push({ id: i, left, top });
      }
      setStars(newStars);
    };

    createStars();
  }, []);

  return (
    <div className="not-found-container">
      <div className="text">
        <div>ERROR</div>
        <h1>404</h1>
        <hr />
        <div>Page Not Found</div>
        <Link href="/pages/home" className="flex z-50 justify-center m-40">
          <Button >Go to Home</Button>
        </Link>
      </div>
      <div className="astronaut">
        <img
          src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png"
          alt=""
          className="src"
        />
      </div>
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{ top: star.top + "px", left: star.left + "px" }}
        ></div>
      ))}
    </div>
  );
};

export default NotFound;
