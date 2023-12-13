
import { Inter } from 'next/font/google'
import '../style/customBootsrap.scss' // for negative margin
import "bootstrap/dist/css/bootstrap.min.css";  
import 'bootstrap-icons/font/bootstrap-icons.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/tree.css';



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NextViewer',
  description: 'A DVB TS Viewer app',
}

export default function RootLayout({ children }) {



  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <div id="container" className="container">
          {children}
        </div>
      </body>
    </html>
  )
}
