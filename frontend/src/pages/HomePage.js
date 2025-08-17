import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Star,
  ChevronRight,
  Play,
  Globe,
  Shield,
  Clock,
} from "lucide-react";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Course Management",
      description:
        "Comprehensive course catalog with easy enrollment and tracking",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Portal",
      description:
        "Personalized dashboard for students to manage their academic journey",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Monitor your academic progress and achievements in real-time",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security to protect your academic data",
    },
  ];

  const stats = [
    { number: "1000+", label: "Students" },
    { number: "50+", label: "Courses" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content:
        "This platform made managing my courses so much easier. The interface is intuitive and everything is organized perfectly.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Data Science Student",
      content:
        "I love how I can track my progress and see all my enrolled courses in one place. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Business Administration Student",
      content:
        "The enrollment process is seamless, and the dashboard gives me everything I need to stay organized.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SCIQUS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Contact
              </a>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-xl rounded-b-2xl border-t border-gray-100">
              <div className="px-4 py-6 space-y-4">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-indigo-600 py-2 font-medium"
                >
                  Features
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-indigo-600 py-2 font-medium"
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-indigo-600 py-2 font-medium"
                >
                  Contact
                </a>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-indigo-600 py-2 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full text-center font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-3/4 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Academic{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Journey
              </span>{" "}
              Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline your education with our comprehensive student and
              course management platform. Enroll, learn, and excel with powerful
              tools designed for modern learning.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2"
              >
                <span>Start Learning Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-8 py-4 rounded-full border-2 border-gray-300 hover:border-indigo-300 transition-all duration-300">
                <Play className="w-5 h-5" />
                <span className="font-semibold">Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-24">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive tools for students and
              administrators to manage courses, track progress, and achieve
              academic excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What Students{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Say About Us
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied students who have transformed their
              learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Built for{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Modern Education
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                SCIQUS is designed to bridge the gap between students and their
                academic goals. Our platform combines cutting-edge technology
                with intuitive design to create a seamless educational
                experience.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Real-time progress tracking",
                  "Seamless course enrollment",
                  "Mobile-responsive design",
                  "Secure data management",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>Join Our Community</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                    <Globe className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm opacity-90">Global Access</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold">Fast</div>
                    <div className="text-sm opacity-90">Response Time</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center col-span-2">
                    <Shield className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold">
                      Enterprise Security
                    </div>
                    <div className="text-sm opacity-90">
                      Your data is protected with industry-leading security
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join thousands of students who are already experiencing the
                future of education management
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <span className="text-2xl font-bold">SCIQUS</span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering students and educators with cutting-edge tools for
                academic excellence. Your journey to success starts here.
              </p>
              <div className="text-gray-400">
                <p>Email: support@sciqus.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Register
                </Link>
                <a
                  href="#features"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a
                  href="mailto:support@sciqus.com"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </a>
                <a
                  href="/privacy"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="mailto:support@sciqus.com"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 SCIQUS. All rights reserved. Built with ❤️ for better
              education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
