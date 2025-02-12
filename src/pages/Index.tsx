
import { useState } from "react";
import { toast } from "sonner";
import { CakeSlice, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [playerName, setPlayerName] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    feeling: "",
    confirmAddress: false,
  });

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast.error("Please enter your name to begin the magical journey!");
      return;
    }
    setAttempts(0);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setAttempts((prev) => prev + 1);

    const degrees = 1440 + Math.random() * 360; // Spin 4 full rotations + random
    const wheel = document.querySelector(".wheel") as HTMLElement;
    if (wheel) {
      wheel.style.transform = `rotate(${degrees}deg)`;
    }

    setTimeout(() => {
      setIsSpinning(false);
      if (attempts >= 2) { // Third attempt
        if (playerName.toLowerCase() === "lavanya") {
          setShowForm(true);
          toast.success("✨ Congratulations! You've won the magical cheesecake! ✨");
        } else {
          toast.error("Thank you for playing! Try again with a different magic name!");
          setTimeout(() => window.location.reload(), 3000);
        }
      }
    }, 4000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmAddress) {
      toast.error("Please confirm your address is correct!");
      return;
    }
    
    // Save form data (in a real app, this would connect to a backend)
    console.log("Form submitted:", formData);
    toast.success("Your magical cheesecake will be delivered soon! ✨");
    setTimeout(() => window.location.reload(), 3000);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-primary/20 to-secondary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div
            className="inline-block"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            The Enchanted Cheesecake Quest
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter the magical realm where dreams of delicious cheesecake come true!
          </p>
        </div>

        {!playerName && (
          <motion.form
            onSubmit={handleNameSubmit}
            className="glass-card max-w-md mx-auto p-8 rounded-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="space-y-4">
              <label className="block text-lg font-medium text-secondary">
                Your Magical Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-primary/50 focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="Enter your name..."
              />
              <button
                type="submit"
                className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Begin Your Quest
              </button>
            </div>
          </motion.form>
        )}

        {playerName && !showForm && (
          <motion.div
            className="glass-card max-w-2xl mx-auto p-8 rounded-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="wheel-container mb-8">
              <div className="wheel">
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
              Spin the Magic Wheel!
            </button>
          </motion.div>
        )}

        {showForm && (
          <motion.form
            onSubmit={handleFormSubmit}
            className="glass-card max-w-2xl mx-auto p-8 rounded-2xl space-y-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center mb-8">
              <CakeSlice className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-secondary">
                Claim Your Magical Cheesecake!
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Phone Number", key: "phone", type: "tel" },
                { label: "Email", key: "email", type: "email" },
                { label: "Delivery Address", key: "address", type: "text" },
                { label: "How are you feeling?", key: "feeling", type: "text" },
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
                  I confirm my address is correct
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Submit and Receive Your Magic Cheesecake!
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
