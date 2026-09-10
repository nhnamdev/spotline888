"use client";

import React, { useEffect, useRef, useState } from "react";
import { getR2Url } from "@/lib/r2";

interface AdminCaptchaProps {
  onCodeChange?: (code: string) => void;
}

export default function AdminCaptcha({ onCodeChange }: AdminCaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const generateCaptcha = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "23456789abcdefhjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (onCodeChange) {
      onCodeChange(code);
    }

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 100, 30);

    // Random background noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150 + 50)}, ${Math.floor(
        Math.random() * 150 + 50
      )}, ${Math.floor(Math.random() * 150 + 50)}, 0.4)`;
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 100, Math.random() * 30);
      ctx.bezierCurveTo(
        Math.random() * 100,
        Math.random() * 30,
        Math.random() * 100,
        Math.random() * 30,
        Math.random() * 100,
        Math.random() * 30
      );
      ctx.stroke();
    }

    // Random dots
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 200)}, ${Math.floor(
        Math.random() * 200
      )}, ${Math.floor(Math.random() * 200)}, 0.5)`;
      ctx.beginPath();
      ctx.arc(Math.random() * 100, Math.random() * 30, Math.random() * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render characters
    ctx.font = "bold 18px 'Helvetica Neue', Arial, sans-serif";
    ctx.textBaseline = "middle";

    for (let i = 0; i < 4; i++) {
      ctx.save();
      const x = 12 + i * 21;
      const y = 15;
      const angle = (Math.random() - 0.5) * 0.4;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 120 + 20)}, ${Math.floor(
        Math.random() * 120 + 20
      )}, ${Math.floor(Math.random() * 120 + 20)})`;
      ctx.fillText(code[i], -6, 0);
      ctx.restore();
    }
  }, [onCodeChange]);

  useEffect(() => {
    if (clickCount > 0) {
      generateCaptcha();
    }
  }, [clickCount, generateCaptcha]);

  return (
    <span
      className="admin-captcha-box"
      style={{
        display: "inline-block",
        width: 100,
        height: 30,
        cursor: "pointer",
        overflow: "hidden",
        verticalAlign: "middle",
        userSelect: "none",
        lineHeight: 0,
      }}
      onClick={() => setClickCount((c) => c + 1)}
      title="点击刷新验证码"
    >
      {clickCount === 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getR2Url("/sites/spotline888-org/admin-login/captcha.png")}
          alt="验证码"
          width={100}
          height={30}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          width={100}
          height={30}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      )}
    </span>
  );
}
