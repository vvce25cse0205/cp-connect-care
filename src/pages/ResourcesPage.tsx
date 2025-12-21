import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ExternalLink, Phone, MapPin, FileText, Download } from 'lucide-react';

interface ResourceDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  content: string;
  links?: { title: string; url: string }[];
  contacts?: { name: string; phone: string; location: string }[];
}

const resourcesData: ResourceDetail[] = [
  {
    id: '1',
    title: 'Daily Therapy Tips for Parents',
    description: 'Simple exercises you can do at home with your child',
    category: 'therapy',
    icon: '💪',
    content: `Home therapy is crucial for continuous progress. Here are key tips:

**Stretching Routine:**
• Do gentle stretches twice daily, morning and evening
• Hold each stretch for 20-30 seconds
• Never force a movement that causes pain

**Positioning:**
• Change your child's position every 20-30 minutes
• Use pillows and supports for proper alignment
• Practice sitting, lying, and standing positions

**Play-Based Therapy:**
• Incorporate therapy into playtime
• Use toys that encourage reaching and grasping
• Make exercises fun with songs and games

**Consistency is Key:**
• Set a regular therapy schedule
• Track progress with photos or videos
• Celebrate small achievements`,
    links: [
      { title: 'CP Foundation Resources', url: 'https://cprf.org' },
      { title: 'Therapy Guide PDF', url: '#' }
    ]
  },
  {
    id: '2',
    title: 'Assistive Equipment Guide',
    description: 'Understanding wheelchairs, walkers, and other mobility aids',
    category: 'equipment',
    icon: '🦽',
    content: `Proper equipment can significantly improve quality of life:

**Mobility Aids:**
• **Wheelchairs**: Manual or powered, custom-fitted
• **Walkers**: Posterior or anterior walkers
• **Standers**: For weight-bearing exercises
• **Gait Trainers**: To support walking practice

**Seating & Positioning:**
• Adaptive seating systems
• Corner chairs for floor play
• Tumble forms and positioning aids

**Daily Living Aids:**
• Adapted utensils for eating
• Bath chairs and supports
• Dressing aids

**Where to Get Equipment:**
• Government schemes (ADIP scheme)
• ALIMCO outlets
• Private suppliers

**Tips:**
• Get professional assessment before buying
• Ensure proper fit and adjustment
• Regular maintenance is important`,
    contacts: [
      { name: 'ALIMCO Helpline', phone: '1800-180-5129', location: 'All India' },
      { name: 'Mobility India', phone: '+91-80-28435624', location: 'Bangalore' }
    ]
  },
  {
    id: '3',
    title: 'Education Rights in India',
    description: "Know your child's rights under RPWD Act 2016",
    category: 'education',
    icon: '📚',
    content: `Every child with CP has the right to education:

**Rights under RPWD Act 2016:**
• Free education until 18 years
• Inclusive education in neighborhood schools
• Right to reasonable accommodations
• Transport and accessibility provisions

**Educational Options:**
• Regular schools with support
• Inclusive schools
• Special schools
• Home-based education

**Getting Support:**
• Apply for UDID (Unique Disability ID)
• Request scribe during exams
• Extra time allowance (usually 20 minutes/hour)
• Assistive technology in classroom

**School Admission Process:**
• 5% reservation in government schools
• Cannot be denied admission based on disability
• File complaint with District Disability Commissioner if needed`,
    links: [
      { title: 'RPWD Act 2016 Full Text', url: 'https://disabilityaffairs.gov.in' },
      { title: 'UDID Registration', url: 'https://swavlambancard.gov.in' }
    ]
  },
  {
    id: '4',
    title: 'Government Schemes & Benefits',
    description: 'Financial assistance available for families in India',
    category: 'financial',
    icon: '💰',
    content: `Various government schemes provide financial support:

**Central Government Schemes:**
• **ADIP Scheme**: Free assistive devices
• **DDRS**: Grants to NGOs for rehabilitation
• **National Trust Schemes**: For welfare of persons with CP

**State Schemes (vary by state):**
• Disability pension (₹500-3000/month)
• Free bus/train travel
• Reservation in government jobs

**Tax Benefits:**
• Section 80U: Deduction up to ₹1.25 lakh
• Section 80DD: For dependent care
• Reduced customs duty on assistive devices

**How to Apply:**
1. Get disability certificate from government hospital
2. Apply for UDID card
3. Register at District Disability Rehabilitation Centre
4. Apply for specific schemes at respective offices`,
    contacts: [
      { name: 'Disability Helpline', phone: '1800-11-5555', location: 'All India' }
    ]
  },
  {
    id: '5',
    title: 'Parent Support Groups',
    description: 'Connect with other CP families across India',
    category: 'support',
    icon: '🤝',
    content: `Connecting with other parents can provide invaluable support:

**Benefits of Support Groups:**
• Share experiences and coping strategies
• Learn from others' journeys
• Emotional support and understanding
• Resource sharing

**Online Communities:**
• Facebook groups for CP parents India
• WhatsApp support groups
• Online forums and communities

**Local Support Groups:**
• Hospital-based parent meetings
• NGO-organized gatherings
• Therapy center parent groups

**Starting Your Own Group:**
• Connect with 3-4 other families
• Meet regularly (weekly/monthly)
• Share resources and information
• Organize group activities`,
    contacts: [
      { name: 'Spastics Society of India', phone: '+91-22-24174696', location: 'Mumbai' },
      { name: 'ADAPT (formerly Spastics Society)', phone: '+91-22-26740127', location: 'Mumbai' }
    ]
  },
  {
    id: '6',
    title: 'Nutrition for CP Children',
    description: 'Feeding tips and dietary recommendations',
    category: 'nutrition',
    icon: '🍎',
    content: `Proper nutrition is essential for growth and development:

**Common Feeding Challenges:**
• Difficulty swallowing (dysphagia)
• Oral motor difficulties
• Gastroesophageal reflux (GERD)
• Constipation

**Feeding Tips:**
• Position child upright during meals
• Use adapted utensils
• Offer foods of appropriate texture
• Allow extra time for meals

**Nutrition Guidelines:**
• High-calorie foods if underweight
• Calcium and Vitamin D for bones
• Iron-rich foods for energy
• Adequate fiber for digestion

**When to Seek Help:**
• Frequent choking or coughing during meals
• Prolonged meal times (>30 minutes)
• Weight loss or poor growth
• Signs of aspiration (food entering airways)`,
    links: [
      { title: 'Feeding Guide PDF', url: '#' }
    ]
  },
  {
    id: '7',
    title: 'Caregiver Mental Health',
    description: 'Taking care of yourself while caring for your child',
    category: 'mental-health',
    icon: '🧘',
    content: `Your wellbeing matters as much as your child's:

**Signs of Caregiver Burnout:**
• Constant fatigue
• Feeling overwhelmed
• Irritability or anxiety
• Neglecting your own health

**Self-Care Strategies:**
• Take regular breaks, even short ones
• Accept help from family and friends
• Join a caregiver support group
• Practice relaxation techniques

**Managing Stress:**
• Deep breathing exercises
• Mindfulness and meditation
• Physical activity
• Adequate sleep

**When to Seek Professional Help:**
• Persistent sadness or hopelessness
• Difficulty functioning
• Thoughts of self-harm
• Severe anxiety

**Resources:**
• iCall: +91-9152987821
• Vandrevala Foundation: 1860-2662-345`,
    contacts: [
      { name: 'iCall Counseling', phone: '+91-9152987821', location: 'All India' },
      { name: 'NIMHANS Helpline', phone: '080-46110007', location: 'Bangalore' }
    ]
  },
  {
    id: '8',
    title: 'Communication Aids (AAC)',
    description: 'Alternative ways for your child to communicate',
    category: 'equipment',
    icon: '💬',
    content: `Augmentative and Alternative Communication (AAC) helps children express themselves:

**Types of AAC:**
• **Low-tech**: Picture boards, communication books
• **Mid-tech**: Simple voice output devices
• **High-tech**: Tablets with AAC apps, eye-gaze systems

**Popular AAC Apps:**
• Avaz (Indian languages supported)
• LAMP Words for Life
• Proloquo2Go
• TouchChat

**Getting Started:**
1. Consult a speech therapist
2. Assess communication needs
3. Start with simple picture exchange
4. Gradually increase vocabulary

**Tips for Success:**
• Model AAC use yourself
• Make AAC available at all times
• Be patient and consistent
• Celebrate all communication attempts`,
    links: [
      { title: 'Avaz AAC App', url: 'https://avazapp.com' },
      { title: 'AAC Resource Guide', url: '#' }
    ]
  }
];

const categories = [
  { value: 'all', label: 'All' },
  { value: 'therapy', label: 'Therapy' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'education', label: 'Education' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'mental-health', label: 'Mental Health' }
];

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState<ResourceDetail | null>(null);

  const filteredResources = selectedCategory === 'all'
    ? resourcesData
    : resourcesData.filter(r => r.category === selectedCategory);

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Resources Library</h1>
        <p className="text-muted-foreground mt-1">Comprehensive information and guides for caregivers in India</p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex-wrap h-auto gap-2">
          {categories.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} variant="interactive">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-3">
                {resource.icon}
              </div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="soft" 
                className="w-full"
                onClick={() => setSelectedResource(resource)}
              >
                <BookOpen className="w-4 h-4 mr-2" /> Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resource Detail Dialog */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-3xl">{selectedResource?.icon}</span>
              {selectedResource?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm bg-transparent p-0">
                {selectedResource?.content}
              </pre>
            </div>

            {selectedResource?.links && selectedResource.links.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Useful Links
                </h4>
                <div className="space-y-2">
                  {selectedResource.links.map((link, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {link.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedResource?.contacts && selectedResource.contacts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Contact Information
                </h4>
                <div className="space-y-3">
                  {selectedResource.contacts.map((contact, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-primary flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {contact.phone}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {contact.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcesPage;
