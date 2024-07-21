/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-white": "#fff",
        "brand-black": "#272727",
        "brand-navy": "#1d375c",
        "brand-green": "#1fbf9b",
        "brand-yellow": "#f9b947",
        "brand-orange": "#D87842",
        "brand-blue": "#22408F",
        "grey-light": "#e7ebef",
        "grey-light-secondary": "#bdc4d2",
        "silver-light": "#f2f5f8",
        "silver-light-secondary": "#CFD6DD",
        "silver-dark": "#ACB8C4",
        "brand-filled-blue": "#0082C8",
        grey: "#4e5656",
        "grey-secondary": "#F0F3F8",
        "brand-green-dark": "#5FB752",
        "brand-red": "#F05133",
        "brand-red-dark": "#EB2700",
        "brand-navy-secondary": "#1D375C",
        "brand-dark-gray": "#58585b",
      },
      screens: {
        xs: "360px",
        xsm: "500px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px",
      },
      fontSize: {
        "oversize-1": ["5rem", "5.5rem"], // 80/88
        "oversize-2": ["4rem", "4.5rem"], // 64/72
        "oversize-3": ["3rem", "3.5rem"], // 48/56
        "oversize-4": ["2.5rem", "3rem"], // 40/48
        "oversize-5": ["2rem", "2.5rem"], // 32/40
        "oversize-6": ["1.5rem", "2rem"], //24/32
        h1: ["1.75rem", "2.25rem"], // 28/36
        h2: ["1.25rem", "1.75rem"], // 20/28
        h3: ["1.125rem", "1.625rem"], // 18/26
        h4: ["1rem", "1.5rem"], // 16/24
        b1: ["0.875rem", "1.375rem"], // 14/22
      },
    },
  },
  plugins: [],
};
