import Link from 'next/link';
import { TypewriterEffect } from './components/ui/typewriter-effect';
import { RiShieldLine, RiLockLine, RiDatabase2Line, RiRobot2Line } from 'react-icons/ri';

export const dynamic = 'force-static';

const features = [
  {
    icon: RiShieldLine,
    title: 'MFA Protection',
    description: 'Secure your users with Multi-Factor Authentication'
  },
  {
    icon: RiLockLine,
    title: 'RLS Security',
    description: 'Row Level Security for granular data access control'
  },
  {
    icon: RiDatabase2Line,
    title: 'PITR Backups',
    description: 'Point-in-Time Recovery for data protection'
  },
  {
    icon: RiRobot2Line,
    title: 'AI Assistant',
    description: 'Get intelligent security recommendations'
  }
];

export default function Home() {
  const words = [
    {
      text: "Secure",
      className: "text-indigo-600 dark:text-black"
    },
    {
      text: "your",
      className: "text-indigo-600 dark:text-black"
    },
    {
      text: "Supabase",
      className: "text-indigo-600 dark:text-black"
    },
    {
      text: "database",
      className: "text-indigo-600 dark:text-black"
    },
    {
      text: "with AI.",
      className: "text-blue-600 dark:text-blue-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <TypewriterEffect words={words} />
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get AI-powered security recommendations and automated protection for your Supabase setup.
            Monitor, secure, and optimize your database security in real-time.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/auth" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/home" 
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium border border-blue-200 hover:border-blue-300 transition-colors"
            >
              Get AI Support
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Security Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to secure your database?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust our AI-powered security assistant to protect their Supabase databases.
          </p>
          <Link 
            href="/auth" 
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Start Securing Now
          </Link>
        </div>
      </div>

      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 Supabase Security Assistant. All rights reserved.</p>
            <div className="flex justify-center gap-4">
              <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
              <Link href="/contact" className="hover:text-blue-600">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 