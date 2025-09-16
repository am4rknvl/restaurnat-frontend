import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ShoppingCart, Users, BarChart3 } from "lucide-react"

const features = [
  {
    title: "Reservations",
    description: "Manage table bookings with real-time availability and automated confirmations.",
    icon: Calendar,
  },
  {
    title: "Orders",
    description: "Streamline order processing from kitchen to customer with live status tracking.",
    icon: ShoppingCart,
  },
  {
    title: "Staff",
    description: "Coordinate your team with shift scheduling, role management, and performance tracking.",
    icon: Users,
  },
  {
    title: "Analytics",
    description: "Make data-driven decisions with comprehensive insights into sales, trends, and performance.",
    icon: BarChart3,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Everything you need to run your restaurant
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our comprehensive platform brings together all the tools you need to manage your restaurant efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
