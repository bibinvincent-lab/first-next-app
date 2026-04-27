// import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';
import MuiProvider from './components/MuiProvider';
import ThemeRegistry from './components/ThemeRegistry';

export const metadata = {
  title: 'BlogSpace - Modern Blog Platform',
  description: 'Discover insights, stories, and expertise from industry leaders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <MuiProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </MuiProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}