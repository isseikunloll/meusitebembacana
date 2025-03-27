import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialLinks() {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button variant="ghost" size="icon" asChild>
        <a href="https://github.com/isseikunloll" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Github className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <a href="https://twitter.com/souissei" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <Twitter className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <Linkedin className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <a href="mailto:isseivollereil@gmail.com" aria-label="Email">
          <Mail className="h-5 w-5" />
        </a>
      </Button>
    </div>
  )
}

