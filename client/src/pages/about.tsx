import { Card } from "@/components/ui/card";
import { Shield, Users, Target, Award, Heart, Zap, Globe, Code, CheckCircle, TrendingUp, Mail } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";

const sections = [
  {
    icon: Target,
    title: "Our Mission",
    content: [
      "AltafToolsHub was founded with a simple yet powerful mission: to provide professional-grade PDF and file processing tools that respect your privacy completely.",
      "**Why We Exist**: In a world where most online tools upload your files to servers, we recognized the critical need for truly private file processing. Whether you're handling confidential business documents, personal financial statements, or sensitive legal papers, your files should never leave your control.",
      "**Our Commitment**: Every tool we build operates 100% in your browser. This isn't just a feature—it's our core philosophy. Your files never touch our servers, ensuring absolute privacy and security.",
      "**The Problem We Solve**: Traditional online PDF tools require file uploads, creating privacy risks, security vulnerabilities, and compliance challenges. We eliminate these concerns entirely through client-side processing."
    ]
  },
  {
    icon: Users,
    title: "Who We Are",
    content: [
      "**Founded in 2024**, AltafToolsHub represents the next generation of privacy-first web applications. We're a dedicated team of software engineers, security experts, and user experience designers committed to revolutionizing how people work with digital documents.",
      "**Our Founder**: Led by Altaf, a senior software engineer with over 10 years of experience in web technologies and cybersecurity. Having worked with Fortune 500 companies on data security challenges, Altaf recognized the critical gap in privacy-respecting file tools.",
      "**Our Team Values**: We believe in transparency, user privacy, technical excellence, and continuous innovation. Every team member is committed to maintaining the highest standards of software development and user trust.",
      "**Technical Expertise**: Our team brings expertise in WebAssembly optimization, browser-based cryptography, PDF manipulation algorithms, and modern web performance techniques. We leverage cutting-edge technologies like React 18, Vite, and WebAssembly to deliver lightning-fast, secure tools."
    ]
  },
  {
    icon: Shield,
    title: "Privacy-First Philosophy",
    content: [
      "**Zero-Knowledge Architecture**: We've designed our entire platform so that we have zero knowledge of your files. This isn't just a promise—it's technically impossible for us to access your data.",
      "**Client-Side Processing**: All file manipulation happens in your browser using JavaScript and WebAssembly. This means your files never leave your device, eliminating the risk of data breaches, unauthorized access, or server-side vulnerabilities.",
      "**No Data Retention**: Since we never receive your files, there's nothing to store, nothing to leak, and nothing to worry about. When you close your browser tab, all traces of your files are gone.",
      "**Compliance Made Easy**: Our approach naturally complies with GDPR, CCPA, HIPAA, and other data protection regulations because we simply don't collect or process personal data on our servers.",
      "**Open Standards**: We use open-source libraries like PDF.js and pdf-lib, allowing technical users to verify our security claims. Our processing methods are transparent and auditable."
    ]
  },
  {
    icon: Award,
    title: "Our Achievements",
    content: [
      "**1.5+ Million Files Processed**: Since our launch, users have successfully processed over 1.5 million PDFs and documents using our tools, all without a single file touching our servers.",
      "**50,000+ Active Users**: Our growing community includes professionals, students, businesses, and organizations who trust us with their document processing needs.",
      "**99.9% Success Rate**: Our tools maintain an exceptional success rate, with robust error handling and browser compatibility across all modern browsers.",
      "**5-Star User Satisfaction**: Based on user feedback, we maintain a 4.9/5 star rating for tool reliability, ease of use, and privacy protection.",
      "**16+ Professional Tools**: We offer a comprehensive suite of PDF and utility tools, from compression and merging to password protection and OCR text extraction.",
      "**Zero Security Incidents**: Since our inception, we've had zero security breaches or data incidents—because there's no data to breach when everything stays on your device."
    ]
  },
  {
    icon: Zap,
    title: "Our Technology",
    content: [
      "**Cutting-Edge Stack**: Built with React 18, TypeScript, and Vite for maximum performance. We use WebAssembly for compute-intensive operations, achieving near-native speeds in your browser.",
      "**Advanced Algorithms**: Our PDF compression uses intelligent algorithms that analyze document structure, optimize images separately from text, and achieve exact target sizes through binary search techniques.",
      "**Browser Compatibility**: Our tools work seamlessly across Chrome, Firefox, Safari, Edge, and all modern browsers. We maintain backwards compatibility while leveraging the latest web APIs.",
      "**Performance Optimization**: Through lazy loading, code splitting, and efficient memory management, we ensure our tools load instantly and run smoothly even on modest hardware.",
      "**Continuous Innovation**: We regularly update our tools with new features, performance improvements, and support for additional file formats based on user feedback and technological advances."
    ]
  },
  {
    icon: Heart,
    title: "Our Commitment to You",
    content: [
      "**Free Forever Core Features**: We believe everyone deserves access to privacy-respecting tools. Our core features will always remain free, with no daily limits or forced registrations.",
      "**No Hidden Costs**: Unlike competitors who lure you with free trials then demand payment, we're transparent about what's free and what might require payment in the future for advanced features.",
      "**User-Driven Development**: Every feature we build comes from user requests and feedback. We maintain an open dialogue with our community to understand and address real needs.",
      "**Educational Resources**: Beyond tools, we provide comprehensive guides, tutorials, and technical documentation to help users understand PDF technology and make informed decisions.",
      "**Responsive Support**: While we're a small team, we're committed to responding to user inquiries within 48 hours and resolving issues promptly."
    ]
  },
  {
    icon: Globe,
    title: "Global Impact",
    content: [
      "**Worldwide Reach**: Our tools are used in over 150 countries, helping people across different languages, cultures, and technical backgrounds process their documents securely.",
      "**Environmental Responsibility**: By eliminating server-side processing, we significantly reduce energy consumption compared to traditional cloud-based tools. No server farms, no cooling systems, just efficient browser-based processing.",
      "**Accessibility Focus**: We're committed to making our tools accessible to everyone, including users with disabilities. We follow WCAG 2.1 guidelines and continuously improve our accessibility features.",
      "**Educational Institutions**: Thousands of students and educators use our tools for academic work, knowing their research papers, dissertations, and sensitive academic documents remain private.",
      "**Small Business Empowerment**: We help small businesses handle their documents professionally without expensive software subscriptions or privacy concerns."
    ]
  },
  {
    icon: TrendingUp,
    title: "Future Vision",
    content: [
      "**Expanding Tool Suite**: We're actively developing 50+ additional tools based on user requests, including advanced PDF editing, form filling, digital signatures, and batch processing capabilities.",
      "**AI Integration**: We're exploring privacy-preserving AI features that run entirely in your browser, bringing intelligent document processing without compromising privacy.",
      "**Offline Capabilities**: We're working on Progressive Web App (PWA) features that will allow our tools to work completely offline, ensuring availability even without internet connection.",
      "**Enterprise Solutions**: While maintaining our free tools, we're developing enterprise features like team collaboration, API access, and advanced security options for businesses.",
      "**Open Source Initiative**: We're planning to open-source key components of our tools, allowing the community to verify our security claims and contribute to development."
    ]
  },
  {
    icon: Code,
    title: "Technical Excellence",
    content: [
      "**Performance Metrics**: Our tools achieve 90+ scores on Google PageSpeed Insights, with sub-2 second load times and instant file processing for documents under 10MB.",
      "**Security Standards**: We implement Content Security Policy (CSP), Subresource Integrity (SRI), HTTPS-only connections, and regular security audits to maintain the highest security standards.",
      "**Quality Assurance**: Every tool undergoes rigorous testing across different browsers, devices, and file types. We maintain comprehensive test suites and perform regular regression testing.",
      "**Code Quality**: We follow industry best practices including TypeScript for type safety, ESLint for code consistency, automated testing pipelines, and continuous integration/deployment.",
      "**Innovation Culture**: Our team regularly explores emerging web technologies like WebGPU for faster processing, WASM SIMD for parallel operations, and new browser APIs for enhanced capabilities."
    ]
  },
  {
    icon: CheckCircle,
    title: "Why Choose AltafToolsHub",
    content: [
      "**Absolute Privacy**: Your files never leave your browser—guaranteed by our architecture, not just our promise.",
      "**No Registration Required**: Start using our tools immediately without creating accounts or providing personal information.",
      "**Professional Quality**: Our tools match or exceed the quality of paid desktop software, all running in your browser.",
      "**Exact Specifications**: Need a PDF compressed to exactly 100KB? Our advanced algorithms achieve precise targets that competitors can't match.",
      "**Comprehensive Suite**: From simple compression to complex manipulation, we offer every PDF tool you need in one place.",
      "**Trusted by Professionals**: Lawyers, accountants, healthcare providers, and government employees trust us with their sensitive documents because we never see them.",
      "**Continuous Improvement**: We release updates weekly, constantly improving performance, adding features, and responding to user feedback.",
      "**Transparent Operations**: We're open about our methods, our team, and our commitment to user privacy. No hidden agendas, no data mining, just tools that work."
    ]
  }
];

export default function About() {
  useSEO({
    title: "About Us - AltafToolsHub | Privacy-First PDF & File Processing Tools",
    description: "Learn about AltafToolsHub's mission to provide 100% private, browser-based PDF tools. Meet our team, understand our technology, and discover why 50,000+ users trust us.",
    keywords: "about altaftoolshub, privacy-first pdf tools, client-side file processing, secure pdf converter, browser-based tools, no upload pdf tools, altaf tools team, pdf tools company",
    path: "/about"
  });

  return (
    <div className="container py-8 md:py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient leading-tight">
            About AltafToolsHub
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Building the future of privacy-first file processing, one tool at a time
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>50,000+ Users</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>150+ Countries</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>16+ Tools</span>
            </div>
          </div>
        </div>

        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 md:p-8 hover-card-effect">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <section.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold flex-1">{section.title}</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                {section.content.map((paragraph, idx) => (
                  <p 
                    key={idx}
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:altaftoolshub@gmail.com" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                data-testid="link-contact-email"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}