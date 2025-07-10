// TeacherSignup.jsx
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Link, useNavigate } from "react-router-dom";

const subjects = [
  "الفيزياء",
  "الكيمياء",
  "الرياضيات",
  "الأحياء",
  "اللغة العربية",
  "اللغة الإنجليزية",
  "أخرى",
];

const TeacherSignup = () => {
  const canvasRef = useRef(null);
  const visualContainerRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    subject: subjects[0],
    email: "",
    experience: "",
    cv: null,
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.full_name) newErrors.full_name = "يرجى إدخال الاسم الكامل.";
    if (!validateEmail(form.email)) newErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    if (!form.experience) newErrors.experience = "يرجى كتابة نبذة عن خبراتك.";
    if (!form.cv) newErrors.cv = "يرجى رفع السيرة الذاتية.";
    if (!validatePassword(form.password))
      newErrors.password = "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وحرف كبير وصغير ورقم وحرف خاص.";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "كلمتا المرور غير متطابقتين.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Form Submitted", form);
      // TODO: Send form data to API here
    }
  };

  useEffect(() => {
    const container = visualContainerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const clock = new THREE.Clock();

    const createNebulaTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");
      const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0.1, "rgba(0, 255, 255, 0.8)");
      gradient.addColorStop(0.4, "rgba(75, 0, 130, 0.5)");
      gradient.addColorStop(1, "rgba(0, 0, 50, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    };

    const nebulaMaterial = new THREE.MeshBasicMaterial({
      map: createNebulaTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const nebulaPlanes = [];
    for (let i = 0; i < 10; i++) {
      const geometry = new THREE.PlaneGeometry(5, 5);
      const plane = new THREE.Mesh(geometry, nebulaMaterial);
      plane.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
      plane.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(plane);
      nebulaPlanes.push(plane);
    }

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      nebulaPlanes.forEach((plane, i) => {
        plane.rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1);
        plane.rotation.x += 0.0005 * (i % 3 === 0 ? 1 : -1);
      });
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black" dir="rtl">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-2  md:gap-8">
          <div className="rounded-3xl h-full border-[1px] border-gray-900 p-8 shadow-2xl shadow-cyan-500/10 bg-[#0a0a19]/50 backdrop-blur-md mb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white">انضم إلى كوكبة المدرسين</h1>
              <p className="text-gray-400 mt-2">كن قائدًا للمعرفة في مجرتنا التعليمية</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-300">الاسم الكامل</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.full_name && <p className="text-red-400 text-xs">{errors.full_name}</p>}
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-300">التخصص الأساسي</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className="form-input w-full p-2 mt-1 rounded-lg">
                    {subjects.map((subj) => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-300">البريد الإلكتروني</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-300">نبذة عن خبراتك</label>
                <textarea name="experience" rows="3" value={form.experience} onChange={handleChange} className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500"></textarea>
                {errors.experience && <p className="text-red-400 text-xs">{errors.experience}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300" htmlFor="cv_upload">ارفع السيرة الذاتية (CV)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <div className="flex text-sm text-gray-400">
                      <label htmlFor="cv_upload" className="relative cursor-pointer bg-gray-800 w-full  rounded-md font-medium text-cyan-400 hover:text-cyan-300">
                        {
                          form.cv? <span className="">{form.cv.name}</span> : <span > اضغط للرفع</span>
                        }
                        <input id="cv_upload" name="cv" type="file"  accept=".pdf,.doc,.docx" onChange={handleChange} className="sr-only" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOCX up to 5MB</p>
                  </div>
                </div>
                {errors.cv && <p className="text-red-400 text-xs mt-1">{errors.cv}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-300">كلمة المرور</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-300">تأكيد كلمة المرور</label>
                  <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className="form-input w-full p-2 mt-1 rounded-lg placeholder-gray-500" />
                  {errors.password_confirmation && <p className="text-red-400 text-xs">{errors.password_confirmation}</p>}
                </div>
              </div>
              <button type="submit" className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-bold bg-cyan-400 text-black hover:bg-cyan-300">
                إرسال طلب الانضمام
              </button>
            </form>
            <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            هل أنت طالب؟
                            <Link to={"/signup"} className="font-medium text-cyan-400 hover:text-cyan-300">أنشئ حساب طالب من هنا</Link>
                        </p>
                    </div>
          </div>
          <div ref={visualContainerRef} className="hidden md:flex relative items-center justify-center p-8">
            <canvas ref={canvasRef} className="absolute rounded-2xl top-0 left-0 w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-8 bg-black/30">
              <h2 className="text-5xl font-black text-white mb-4">المجرّة.</h2>
              <p className="text-gray-300 text-lg">كن نجمًا يضيء سماء المعرفة لآلاف الطلاب.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignup;