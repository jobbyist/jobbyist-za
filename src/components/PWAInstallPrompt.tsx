import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has dismissed the prompt before
      const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
      const dismissedTime = hasDismissed ? parseInt(hasDismissed, 10) : 0;
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      
      // Show prompt if not dismissed or dismissed more than 3 days ago
      if (!hasDismissed || (Date.now() - dismissedTime) > threeDaysInMs) {
        // Show prompt after a short delay for better UX
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000); // Show after 5 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS prompt if on iOS and not in standalone mode
    if (iOS && !isInStandaloneMode) {
      const hasIOSDismissed = localStorage.getItem('pwa-ios-prompt-dismissed');
      const dismissedTime = hasIOSDismissed ? parseInt(hasIOSDismissed, 10) : 0;
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      
      if (!hasIOSDismissed || (Date.now() - dismissedTime) > threeDaysInMs) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa-ios-prompt-dismissed', Date.now().toString());
    } else {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }
  };

  // Don't show if already installed
  if (isStandalone) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isIOS ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            Install Jobbyist App
          </DialogTitle>
          <DialogDescription className="pt-2">
            Get quick access to job opportunities right from your home screen!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <img 
            src="/jobbyistpwa.png" 
            alt="Jobbyist" 
            className="w-24 h-24 rounded-2xl shadow-lg"
          />
          
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Quick access from your home screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Works offline with cached content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Get instant job alerts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Fast and app-like experience</span>
            </li>
          </ul>

          {isIOS ? (
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2 w-full">
              <p className="font-semibold">To install on iOS:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Tap the Share button in Safari</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right corner</li>
              </ol>
            </div>
          ) : null}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={handleDismiss}>
            <X className="h-4 w-4 mr-1" />
            Not now
          </Button>
          {!isIOS && deferredPrompt && (
            <Button onClick={handleInstallClick}>
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
          {isIOS && (
            <Button onClick={handleDismiss}>
              Got it
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallPrompt;
