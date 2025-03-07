import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Recipes from "./pages/Recipes.jsx";
import Blog from "./pages/Blog.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Layout from "./components/Layout.jsx";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import RecipeDetail from "./components/RecipeDetail.jsx";
import BlogDetail from "./components/BlogDetail.jsx";
import PrintRecipe from "./pages/PrintRecipe.jsx";
import NoLayout from "./components/NoLayout.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import DataDeletion from "./pages/DataDeletion.jsx";

function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Ld7OzUqAAAAAETZn0UbSjjR_oX3anLY77Ptt08r">
      <Router>
        <Routes>
          {/* Routes with Layout (Navbar + Footer) */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipes/:slug" element={<RecipeDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/data-deletion" element={<DataDeletion />} />
                </Routes>
              </Layout>
            }
          />

          {/* Route WITHOUT Layout (No Navbar/Footer) */}
          <Route
            path="/print/:slug"
            element={
              <NoLayout>
                <PrintRecipe />
              </NoLayout>
            }
          />
        </Routes>
      </Router>
    </GoogleReCaptchaProvider>
  );
}

export default App;
