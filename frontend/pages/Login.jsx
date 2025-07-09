import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // --- Three.js Starfield Animation ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
    });
    const stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    document.addEventListener("mousemove", handleMouseMove);

    const clock = new THREE.Clock();

    function animate() {
      const elapsedTime = clock.getElapsedTime();
      stars.rotation.y = -elapsedTime * 0.01;
      camera.position.x += (mouseX - window.innerWidth / 2) * 0.000005;
      camera.position.y += (-mouseY + window.innerHeight / 2) * 0.000005;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    }

    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
    };
  }, []);

  const validateEmail = (value) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value) => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("يرجى إدخال بريد إلكتروني صالح.");
      valid = false;
    }
    if (!password) {
      setPasswordError("يرجى إدخال كلمة المرور.");
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص.");
      valid = false;
    }
    if (!valid) return;
    // TODO: send data to backend and redirect to dashboard based on user type
    console.log(email, password);
  };

  return (
    <>
      {/* Starfield Canvas */}
      {/* must be a direct child of the fragment, not inside any div */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -10,
          display: "block",
          pointerEvents: "none",
        }}
      />
      {/* Login Form Layout */}
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl" lang="ar" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="w-full max-w-md">
          <div
            className="rounded-2xl p-8 shadow-2xl"
            style={{
              background: "rgba(10, 10, 25, 0.5)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-black text-white"
                style={{
                  textShadow: "0 0 10px rgba(0, 191, 255, 0.6)",
                }}
              >
                المجرّة.
              </h1>
              <p className="text-gray-400 mt-2">بوابة الدخول إلى محطة المعرفة</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-300">
                  البريد الإلكتروني
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full p-3 rounded-lg placeholder-gray-500"
                    placeholder="name@domain.com"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                    }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <div className="text-red-400 text-xs mt-1">{emailError}</div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-300">
                  كلمة المرور
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full p-3 rounded-lg placeholder-gray-500"
                    placeholder="••••••••"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                    }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <div className="text-red-400 text-xs mt-1">{passwordError}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-cyan-400 hover:text-cyan-300">
                    نسيت كلمة المرور؟
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold"
                  style={{
                    backgroundColor: "#00BFFF",
                    color: "#000",
                    fontWeight: "bold",
                    boxShadow: "0 0 15px rgba(0, 191, 255, 0.4)",
                  }}
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2" style={{ background: "#0a0a19", color: "#888" }}>
                    ليس لديك حساب؟
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10"
                  onClick={() => navigate("/signup")}
                >
                  أنشئ محطة جديدة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;