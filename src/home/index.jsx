import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from '@clerk/clerk-react';
import React from 'react';
import Header from '../components/custom/Header';
import { 
  CheckCircle, 
  Zap, 
  Users, 
  Trophy, 
  ArrowRight,
  Sparkles,
  FileText,
  Download,
  Eye,
  Star
} from 'lucide-react';

function Home() {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "AI-Powered Writing",
      description: "Advanced AI analyzes your experience and crafts compelling, professional content tailored to your industry."
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "ATS-Optimized",
      description: "Every resume is optimized for Applicant Tracking Systems to ensure your application gets noticed."
    },
    {
      icon: <Download className="w-8 h-8 text-primary" />,
      title: "Multiple Formats",
      description: "Download in PDF, Word, or share online with a professional link that's always up-to-date."
    }
  ];

  const stats = [
    { number: "50K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "500+", label: "Companies Trust Us" },
    { number: "4.9", label: "Average Rating" }
  ];



  return (
    <div className="relative min-h-screen w-full overflow-hidden">
          <div className="min-h-screen w-full bg-gradient-to-br from-gray-50/90 to-gray-200/90 backdrop-blur-sm">
            <Header />
            
            {/* Hero Section */}
            <div className="mt-20 flex flex-col items-center justify-center text-center px-4">
              <div className="flex items-center mb-4 bg-primary/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">AI-Powered Resume Builder</span>
              </div>
              
              <h1 className="font-extrabold text-6xl sm:text-7xl mb-4 tracking-tight">
                Res
                <span className="text-primary drop-shadow-lg animate-pulse">Mancer</span>
              </h1>
              
              <h2 className="font-semibold text-3xl sm:text-5xl text-gray-700 mb-6">
                Build Your Resume <span className="text-primary">With AI</span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-8">
                Create stunning, ATS-friendly resumes in seconds. Let AI craft your professional story 
                and land your dream job faster than ever before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {isSignedIn ? (
                  <Link to="/dashboard">
                    <Button className="px-10 py-6 text-xl rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                      Create Resume
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/sign-in">
                      <Button className="px-10 py-6 text-xl rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-16">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span>4.9/5 from 2,000+ reviews</span>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white/50 backdrop-blur-sm py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                    Why Choose ResMancer?
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Our cutting-edge AI technology and intuitive design make creating 
                    professional resumes effortless and effective.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center mb-4">
                        {feature.icon}
                        <h4 className="text-xl font-semibold text-gray-800 ml-3">
                          {feature.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                    Simple 3-Step Process
                  </h3>
                  <p className="text-lg text-gray-600">
                    Get your professional resume ready in minutes
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      Enter Your Details
                    </h4>
                    <p className="text-gray-600">
                      Add your work experience, education, and skills. Our AI will guide you through each step.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      AI Enhancement
                    </h4>
                    <p className="text-gray-600">
                      Watch as our AI transforms your information into compelling, professional content.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      Download & Apply
                    </h4>
                    <p className="text-gray-600">
                      Get your polished resume in multiple formats and start applying to your dream jobs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary to-primary/80 py-20 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-xl text-white/90 mb-8">
                  Join thousands of professionals who've already upgraded their resumes with AI
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isSignedIn ? (
                    <Link to="/dashboard">
                      <Button className="px-10 py-6 text-xl bg-white text-primary hover:bg-gray-100 rounded-lg shadow-lg">
                        Create Your Resume Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth/sign-in">
                      <Button className="px-10 py-6 text-xl bg-white text-primary hover:bg-gray-100 rounded-lg shadow-lg">
                        Start Free Today
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </div>
                <p className="text-white/80 mt-4 text-sm">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>
            </div>

            {/* Footer */}
             <footer className="bg-gray-900 text-white py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h4 className="text-2xl font-bold mb-4">
                  Res<span className="text-primary">Mancer</span>
                </h4>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  AI-powered resume builder helping professionals land their dream jobs.
                </p>
                <div className="border-t border-gray-800 pt-8 text-gray-400">
                  <p>&copy; 2025 ResMancer. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>

    </div>
  );
}

export default Home;