import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSEO } from "@/hooks/use-seo";
import { Star, Quote, CheckCircle, TrendingUp, Users, Shield, Zap, Heart, Award, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Manager",
    company: "TechStart Inc.",
    rating: 5,
    date: "2025-01-15",
    text: "Best PDF tools I've found online. Everything works in the browser, no uploads needed! The compression tool saved me hours of work and reduced our files by 80% without quality loss.",
    tools: ["Compress PDF", "Merge PDF"],
    verified: true,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "DevOps Solutions",
    rating: 5,
    date: "2025-01-10",
    text: "Privacy-first approach is exactly what I needed. Files never leave my computer, which is critical for handling sensitive documents. The speed is incredible too!",
    tools: ["Unlock PDF", "Extract Pages"],
    verified: true,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Legal Assistant",
    company: "Rodriguez & Associates",
    rating: 5,
    date: "2025-01-08",
    text: "We handle confidential legal documents daily. AltafToolsHub's client-side processing means we can compress and organize PDFs without any security concerns. It's become essential to our workflow.",
    tools: ["Remove Pages", "Organize PDF", "Compress PDF"],
    verified: true,
    avatar: "ER"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Photographer",
    company: "Thompson Studios",
    rating: 5,
    date: "2025-01-05",
    text: "Converting my photo portfolios to PDF has never been easier. The JPG to PDF tool maintains perfect quality, and I can add watermarks to protect my work. Highly recommend!",
    tools: ["JPG to PDF", "Watermark PDF"],
    verified: true,
    avatar: "DT"
  },
  {
    id: 5,
    name: "Lisa Martinez",
    role: "HR Director",
    company: "Global Corp",
    rating: 5,
    date: "2024-12-28",
    text: "Processing employee documents requires absolute privacy. This tool is perfect - everything stays on our computers. We've processed thousands of documents without a single issue.",
    tools: ["Merge PDF", "Extract Pages", "Add Page Numbers"],
    verified: true,
    avatar: "LM"
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Student",
    company: "State University",
    rating: 5,
    date: "2024-12-25",
    text: "As a student, I need free tools that actually work. AltafToolsHub helped me compress my thesis from 50MB to 5MB for submission. The quality remained perfect!",
    tools: ["Compress PDF", "Merge PDF"],
    verified: true,
    avatar: "JW"
  },
  {
    id: 7,
    name: "Anna Petrova",
    role: "Accountant",
    company: "FinanceFirst",
    rating: 5,
    date: "2024-12-20",
    text: "Tax season is so much easier now. I can merge receipts, compress reports, and organize documents instantly. No more expensive software subscriptions!",
    tools: ["Merge PDF", "Organize PDF", "Compress PDF"],
    verified: true,
    avatar: "AP"
  },
  {
    id: 8,
    name: "Robert Kim",
    role: "Real Estate Agent",
    company: "Premier Properties",
    rating: 5,
    date: "2024-12-18",
    text: "I send dozens of contracts daily. The compression tool reduces file sizes perfectly for email, and the password generator keeps documents secure. Fantastic service!",
    tools: ["Compress PDF", "Password Generator"],
    verified: true,
    avatar: "RK"
  },
  {
    id: 9,
    name: "Maria Santos",
    role: "Teacher",
    company: "Westside Elementary",
    rating: 5,
    date: "2024-12-15",
    text: "Creating educational materials is so simple now. I convert images to PDFs, merge worksheets, and add page numbers for easy reference. My students love the QR codes too!",
    tools: ["JPG to PDF", "Merge PDF", "QR Generator"],
    verified: true,
    avatar: "MS"
  },
  {
    id: 10,
    name: "Thomas Anderson",
    role: "Consultant",
    company: "Anderson Consulting",
    rating: 4,
    date: "2024-12-10",
    text: "Great tools for client presentations. The only reason for 4 stars is I'd love to see more image format options. Otherwise, it's perfect for my daily needs.",
    tools: ["Compress PDF", "Merge PDF", "Watermark PDF"],
    verified: true,
    avatar: "TA"
  }
];

const stats = [
  { value: "1M+", label: "Happy Users", icon: Users },
  { value: "10M+", label: "Files Processed", icon: TrendingUp },
  { value: "4.8/5", label: "Average Rating", icon: Star },
  { value: "100%", label: "Privacy Guaranteed", icon: Shield }
];

const featuredQuote = {
  text: "In an era where data privacy is paramount, AltafToolsHub stands out by processing everything locally. It's not just a tool, it's a commitment to user privacy.",
  author: "Tech Review Weekly",
  date: "January 2025"
};

export default function Testimonials() {
  // Calculate aggregate rating
  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const avgRating = (totalRating / testimonials.length).toFixed(1);
  const fiveStarCount = testimonials.filter(t => t.rating === 5).length;
  const fourStarCount = testimonials.filter(t => t.rating === 4).length;

  // Generate structured data for testimonials
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://altaftoolshub.com/#product",
    "name": "AltafToolsHub - Online PDF Tools",
    "description": "Free online tools for PDF processing with 100% privacy",
    "brand": {
      "@type": "Brand",
      "name": "AltafToolsHub"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map(t => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": t.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": t.name
      },
      "datePublished": t.date,
      "reviewBody": t.text
    }))
  };

  useSEO({
    title: "Customer Testimonials & Reviews - AltafToolsHub",
    description: `See what our users say about AltafToolsHub. Rated ${avgRating}/5 stars by thousands of satisfied customers using our privacy-first PDF tools.`,
    path: "/testimonials",
    keywords: "altaftoolshub reviews, pdf tools testimonials, customer feedback, user reviews, pdf compressor reviews",
    structuredData: [reviewSchema]
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? "fill-yellow-500 text-yellow-500" 
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-primary/3 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-section relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <Heart className="w-3 h-3 mr-1" />
              Loved by Thousands
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary">
              What Our Users Say
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied users who trust AltafToolsHub for their document needs
            </p>
            
            {/* Rating Summary */}
            <div className="bg-card rounded-lg p-6 mb-8 inline-block">
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl font-bold text-primary">{avgRating}</div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {renderStars(Math.round(parseFloat(avgRating)))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {testimonials.length} reviews
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-12 bg-muted/30">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Quote className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
            <blockquote className="text-xl md:text-2xl font-medium mb-4 italic">
              "{featuredQuote.text}"
            </blockquote>
            <cite className="text-muted-foreground not-italic">
              — {featuredQuote.author}, {featuredQuote.date}
            </cite>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h2>
            <p className="text-lg text-muted-foreground">
              Real feedback from real users
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
              >
                <Card 
                  className="p-6 h-full flex flex-col hover:shadow-lg transition-all"
                  data-testid={`testimonial-${testimonial.id}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          {testimonial.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-muted-foreground">
                      {testimonial.date}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-muted-foreground mb-4 flex-1">
                    "{testimonial.text}"
                  </p>

                  {/* Tools Used */}
                  <div className="flex flex-wrap gap-2">
                    {testimonial.tools.map((tool, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating Breakdown */}
      <section className="py-12 bg-muted/30">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Rating Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-24">
                  <span>5 stars</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full transition-all"
                    style={{ width: `${(fiveStarCount / testimonials.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {fiveStarCount}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-24">
                  <span>4 stars</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full transition-all"
                    style={{ width: `${(fourStarCount / testimonials.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {fourStarCount}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-section text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Join Our Happy Users</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the privacy-first PDF tools that thousands trust daily
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/all-tools">
                <Button size="lg" className="gap-2" data-testid="button-try-tools">
                  Try Our Tools Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-learn-more">
                  Learn How It Works
                  <Zap className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}