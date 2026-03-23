export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-white/5 bg-transparent backdrop-blur-sm relative z-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-white/40 text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} SmartDashboard Inc. All rights reserved.
        </div>
        <div className="flex space-x-6 text-sm text-white/60">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
