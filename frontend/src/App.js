import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { LangProvider } from "@/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import NewsDetailPage from "@/pages/NewsDetailPage";

function App() {
  return (
    <LangProvider>
      <div className="App scanlines grain">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#13131a",
              border: "1px solid #ff00ff",
              color: "#fff",
            },
          }}
        />
      </div>
    </LangProvider>
  );
}

export default App;
