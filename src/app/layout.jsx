import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "@/context/AuthContext";
import GlobalProvider from "@/context/GlobalContext";
import UserProvider from "@/context/UserContext";
import AppointmentProvider from "@/context/AppointmentContext";
import BookingProvider from "@/context/BookingContext";
import BookingServiceProvider from "@/context/BookingServiceContext";
import HealthProvider from "@/context/HealthContext";
import UtilsProvider from '@/context/UtilsContext'
import BookingHomeProvider from "@/context/BookingHomeContext";

export const metadata = {
  title: "HealthHaven",
  description: "",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="qPr_3m_jtgVoFmOL2IRmvbU2OdtNkvMzWNbAkpMcueU" />
      </head>
      <body className="font-space">
        <UtilsProvider>
          <UserProvider>
            <BookingHomeProvider>
              <BookingProvider>
                <BookingServiceProvider>
                  <AppointmentProvider>
                    <GlobalProvider>
                      <AuthContext>
                        <HealthProvider>
                          {children}
                        </HealthProvider>
                      </AuthContext>
                    </GlobalProvider>
                  </AppointmentProvider>
                </BookingServiceProvider>
              </BookingProvider>
            </BookingHomeProvider>
          </UserProvider>
        </UtilsProvider>
      </body>
    </html>
  );
}
