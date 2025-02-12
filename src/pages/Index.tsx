import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CakeSlice, Crown, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';

const Index = () => {
  const [playerName, setPlayerName] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastDegrees, setLastDegrees] = useState(0);
  const [showWinners, setShowWinners] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [winners, setWinners] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    feeling: "",
    confirmAddress: false,
  });

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast.error("Please enter your name to begin the magical journey!");
      return;
    }
    setGameStarted(true);
    toast.success(`Welcome to the magical quest, ${playerName}! ✨`);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setAttempts((prev) => prev + 1);

    const baseRotation = 1440;
    const randomRotation = Math.random() * 360;
    const totalRotation = baseRotation + randomRotation;
    
    const wheel = document.querySelector(".wheel") as HTMLElement;
    if (wheel) {
      const newDegrees = lastDegrees + totalRotation;
      wheel.style.transform = `rotate(${newDegrees}deg)`;
      setLastDegrees(newDegrees);
    }

    setTimeout(() => {
      setIsSpinning(false);
      if (attempts >= 2) {
        const normalizedName = playerName.toLowerCase().trim();
        if (normalizedName.includes("lavanya"))  {
          setShowForm(true);
          triggerConfetti();
          toast.success("✨ Congratulations! You've won the magical cheesecake! ✨");
        } else {
          toast.error("Thank you for playing! Try again with a different magic name!");
          setTimeout(() => window.location.reload(), 3000);
        }
      } else {
        toast("Keep trying! Magic takes time ✨");
      }
    }, 4000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmAddress) {
      toast.error("Please confirm your address is correct!");
      return;
    }
    
    const winners = JSON.parse(localStorage.getItem('winners') || '[]');
    winners.push({
      ...formData,
      timestamp: new Date().toISOString(),
      playerName
    });
    localStorage.setItem('winners', JSON.stringify(winners));
    
    toast.success("Your magical cheesecake will be delivered soon! ✨");
    triggerConfetti();
    setTimeout(() => window.location.reload(), 3000);
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      const storedWinners = JSON.parse(localStorage.getItem('winners') || '[]');
      setWinners(storedWinners);
      setShowWinners(true);
      setAdminPassword('');
    } else {
      toast.error("Incorrect password!");
    }
  };

  return (
    <div className="min-h-screen py-4 md:py-8 px-2 md:px-4 bg-gradient-to-b from-primary/20 to-secondary/20">
      <div className="fixed inset-0 -z-10 opacity-10">
        <img 
          src="/photo-1581091226825-a6a2a5aee158" 
          alt="Castle"
          className="w-full h-full object-cover"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="absolute top-4 right-4">
          {!showWinners ? (
            <form onSubmit={handleAdminAccess} className="flex gap-2">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
                className="px-2 py-1 rounded-lg border border-primary/50 text-sm"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-secondary text-white rounded-lg text-sm hover:bg-secondary/90"
              >
                View Winners
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowWinners(false)}
              className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
            >
              Back to Game
            </button>
          )}
        </div>

        {showWinners ? (
          <div className="glass-card p-6 rounded-2xl mt-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">Winner's List</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Contact</th>
                    <th className="p-2 text-left">Address</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((winner, index) => (
                    <tr key={index} className="border-b border-primary/10">
                      <td className="p-2">{winner.name}</td>
                      <td className="p-2">{winner.phone}<br/>{winner.email}</td>
                      <td className="p-2">{winner.address}</td>
                      <td className="p-2">{new Date(winner.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 md:mb-12 relative">
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20"
                >
                  <img 
                    src="/photo-1535268647677-300dbf3d78d1" 
                    alt="Decorative"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute top-1/3 right-1/4 w-32 h-32 opacity-20"
                >
                  <img 
                    src="/photo-1501286353178-1ec881214838" 
                    alt="Decorative"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
              
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 3) * 15}%`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                </motion.div>
              ))}
              
              <motion.div
                className="inline-block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-12 h-12 md:w-16 md:h-16 text-accent mx-auto mb-4" />
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4 drop-shadow-lg">
                The Enchanted Cheesecake Quest
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Where every princess deserves a magical slice of happiness! ✨
              </p>
            </div>

            {!gameStarted && (
              <motion.form
                onSubmit={handleNameSubmit}
                className="glass-card max-w-md mx-auto p-6 md:p-8 rounded-2xl shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-secondary">
                    Your Royal Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-primary/50 focus:ring-2 focus:ring-accent focus:outline-none bg-white/50"
                    placeholder="Enter your name..."
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors transform hover:scale-105 duration-200 shadow-lg"
                  >
                    Begin Your Royal Quest
                  </button>
                </div>
              </motion.form>
            )}

            {gameStarted && !showForm && (
              <motion.div
                className="glass-card max-w-2xl mx-auto p-6 md:p-8 rounded-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="wheel-container mb-8">
                  <div className="wheel glass-card">
                    {[
                      "Try Again!",
                      "So Close!",
                      "Next Time!",
                      "Almost There!",
                      "Keep Spinning!",
                      "Not Yet!",
                    ].map((text, i) => (
                      <div
                        key={i}
                        className="wheel-section"
                        style={{
                          transform: `rotate(${i * 60}deg)`,
                          backgroundColor: [
                            "#FF9AA2",
                            "#FFB7B2",
                            "#FFDAC1",
                            "#E2F0CB",
                            "#B5EAD7",
                            "#C7CEEA",
                          ][i],
                        }}
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-lg mb-4">
                  Magic Attempts: {attempts}/3
                </p>
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="w-full py-3 px-6 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Cast Your Spinning Spell!
                </button>
              </motion.div>
            )}

            {showForm && (
              <motion.form
                onSubmit={handleFormSubmit}
                className="glass-card max-w-2xl mx-auto p-6 md:p-8 rounded-2xl space-y-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-center mb-8">
                  <CakeSlice className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-secondary">
                    Claim Your Royal Cheesecake!
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Royal Name", key: "name", type: "text" },
                    { label: "Royal Messenger (Phone)", key: "phone", type: "tel" },
                    { label: "Magic Scroll (Email)", key: "email", type: "email" },
                    { label: "Castle Address", key: "address", type: "text" },
                    { label: "Share Your Joy!", key: "feeling", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.key as keyof typeof formData] as string}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-primary/50 focus:ring-2 focus:ring-accent focus:outline-none"
                        required
                      />
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="confirmAddress"
                      checked={formData.confirmAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmAddress: e.target.checked,
                        }))
                      }
                      className="rounded border-primary/50 text-accent focus:ring-accent"
                    />
                    <label
                      htmlFor="confirmAddress"
                      className="text-sm text-secondary"
                    >
                      I confirm my castle address is correct
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Send the Royal Baker!
                  </button>
                </div>
              </motion.form>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
