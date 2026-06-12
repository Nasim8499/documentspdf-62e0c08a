import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home";
import CreateDocument from "./pages/CreateDocument";
import DocumentSettings from "./pages/DocumentSettings";
import AdditionalOptions from "./pages/AdditionalOptions";
import Generating from "./pages/Generating";
import PdfPreview from "./pages/PdfPreview";
import Library from "./pages/Library";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Templates from "./pages/Templates";
import Export from "./pages/Export";
import Analytics from "./pages/Analytics";
import Itinerary from "./pages/Itinerary";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreateDocument />} />
          <Route path="/settings" element={<DocumentSettings />} />
          <Route path="/options" element={<AdditionalOptions />} />
          <Route path="/generating" element={<Generating />} />
          <Route path="/preview" element={<PdfPreview />} />
          <Route path="/library" element={<Library />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/export" element={<Export />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
