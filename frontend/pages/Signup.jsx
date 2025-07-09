import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

const academicYears = [
  "الصف الأول الثانوي",
  "الصف الثاني الثانوي",
  "الصف الثالث الثانوي",
];

const Signup = () => {
  const canvasRef = useRef(null);
  const visualContainerRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    parent_name: "",
    parent_phone: "",
    email: "",
    academic_year: academicYears[0],
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePhone = (value) =>
    /^\d{8,15}$/.test(value.replace(/\D/g, ""));

  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.full_name) newErrors.full_name = "يرجى إدخال اسم الطالب الكامل.";
    if (!validatePhone(form.phone_number)) newErrors.phone_number = "رقم الهاتف غير صحيح.";
    if (!form.parent_name) newErrors.parent_name = "يرجى إدخال اسم ولي الأمر.";
    if (!validatePhone(form.parent_phone)) newErrors.parent_phone = "رقم هاتف ولي الأمر غير صحيح.";
    if (!validateEmail(form.email)) newErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    if (!validatePassword(form.password)) newErrors.password = "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص.";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "كلمتا المرور غير متطابقتين.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Form Submitted:", form);
    }

    // TODO: send data to backend
  };

  useEffect(() => {
    const container = visualContainerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const solarSystem = new THREE.Group();
    scene.add(solarSystem);
    solarSystem.rotation.x = 0.4;

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.1 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffdd00,
        emissive: 0xffcc00,
        emissiveIntensity: 1,
      })
    );
    solarSystem.add(sun);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 100, 1000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Planets
    const planetsData = [
      { distance: 5, size: 0.3, color: 0x8c8c8c, speed: 0.01 },
      { distance: 7, size: 0.6, color: 0xe6e6e6, speed: 0.007 },
      { distance: 10, size: 0.7, color: 0x00bfff, speed: 0.005 },
      { distance: 14, size: 0.4, color: 0xff5733, speed: 0.004 },
    ];
    const planets = [];

    planetsData.forEach((pData) => {
      const geo = new THREE.SphereGeometry(pData.size, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: pData.color,
        roughness: 0.8,
        metalness: 0.2,
      });
      const planet = new THREE.Mesh(geo, mat);
      planet.position.x = pData.distance;
      const container = new THREE.Group();
      container.add(planet);
      solarSystem.add(container);

      const orbitGeo = new THREE.RingGeometry(pData.distance - 0.02, pData.distance + 0.02, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1,
      });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = -0.5 * Math.PI;
      solarSystem.add(orbit);

      planets.push({ mesh: planet, container, speed: pData.speed });
    });

    let mouseX = 0, mouseY = 0;
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.005;
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.005;
    });

    container.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      planets.forEach((p) => {
        p.container.rotation.y += p.speed;
        p.mesh.rotation.y = elapsedTime * 0.5;
      });
      sun.rotation.y = elapsedTime * 0.05;
      solarSystem.rotation.y += 0.0005;

      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY - (camera.position.y - 15)) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black gla" dir="rtl" lang="ar">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-2 md:gap-8">
          {/* Form Section */}
          <div className="form-container rounded-2xl p-8 shadow-2xl  shadow-cyan-500/10 border-gray-900 border-[1px] bg-[#0a0a19]/50 backdrop-blur-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white title-glow">إنشاء محطة جديدة</h1>
              <p className="text-gray-400 mt-2">انضم إلى المجرّة وابدأ رحلتك نحو التفوق</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300">اسم الطالب الكامل</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.full_name && <p className="text-red-400 text-xs">{errors.full_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300">رقم هاتف الطالب</label>
                  <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} required className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.phone_number && <p className="text-red-400 text-xs">{errors.phone_number}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300">اسم ولي الأمر</label>
                  <input type="text" name="parent_name" value={form.parent_name} onChange={handleChange} required className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.parent_name && <p className="text-red-400 text-xs">{errors.parent_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300">رقم هاتف ولي الأمر</label>
                  <input type="tel" name="parent_phone" value={form.parent_phone} onChange={handleChange} required className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.parent_phone && <p className="text-red-400 text-xs">{errors.parent_phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300">البريد الإلكتروني</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300">السنة الدراسية</label>
                <select name="academic_year" value={form.academic_year} onChange={handleChange} className="form-input w-full p-2 mt-1 rounded-lg">
                  {academicYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300">كلمة المرور</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} required className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300">تأكيد كلمة المرور</label>
                  <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.password_confirmation && <p className="text-red-400 text-xs">{errors.password_confirmation}</p>}
                </div>
              </div>

              <div>
                <button type="submit" className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-bold bg-cyan-400 text-black hover:bg-cyan-300">
                  إنشاء الحساب
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              لديك حساب بالفعل؟
              <button onClick={() => navigate("/login")} className="font-medium text-cyan-400 hover:text-cyan-300 ml-2">
                سجل الدخول من هنا
              </button>
            </div>
          </div>

          {/* Visual Section */}
          <div ref={visualContainerRef} className="visuals-container hidden md:flex flex-col items-center justify-center p-8 relative">
            <canvas ref={canvasRef} id="solar-system-canvas" className="absolute top-0 left-0 w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
