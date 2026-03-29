import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import UserPrograms from "@/components/UserProgram";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-7 space-y-8 relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground">Enhance Your</span>
                </div>
                <div>
                  <span className="text-primary">English Pronunciation</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">With Advanced</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary"> Technology</span>
                </div>
              </h1>

              {/* <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50" /> */}

              <p className="text-xl text-muted-foreground w-2/3">
                Level up your pronunciation and vocabulary with a dedicated AI
                language coach tailored to your needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link
                    href={"/conversation"}
                    className="flex items-center font-mono"
                  >
                    Start Learning
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side */}
            <div className="lg:col-span-5 relative">
              {/* IMAGE CONTANINER */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-t-lg bg-cyber-black">
                  <Image
                    src="/hero-ai.png"
                    alt="AI Fitness Coach"
                    width={500}
                    height={500}
                    className="size-full object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UserPrograms />
    </div>
  );
};

export default HomePage;
