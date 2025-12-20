import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Star, Navigation, Locate, Building2, Stethoscope } from 'lucide-react';
import { indianHospitals } from '@/data/sampleData';
import { toast } from 'sonner';

const HospitalsPage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hospitalsWithDistance, setHospitalsWithDistance] = useState(indianHospitals);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const findNearMe = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          const updated = indianHospitals.map(h => ({
            ...h,
            distance: calculateDistance(latitude, longitude, h.latitude, h.longitude)
          })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
          
          setHospitalsWithDistance(updated);
          setLoading(false);
          toast.success('📍 Found hospitals near you!');
        },
        (error) => {
          setLoading(false);
          toast.error('Could not get your location. Please enable location access.');
        }
      );
    } else {
      setLoading(false);
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const filteredHospitals = hospitalsWithDistance.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">CP-Specialized Hospitals</h1>
        <p className="text-muted-foreground mt-1">Find the best cerebral palsy care centers in India</p>
      </div>

      {/* Search and Location */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by hospital name, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="hero" 
          onClick={findNearMe}
          disabled={loading}
        >
          <Locate className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Finding...' : 'Find Near Me'}
        </Button>
      </div>

      {userLocation && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success text-sm">
          <MapPin className="w-4 h-4" />
          Location detected! Showing hospitals sorted by distance.
        </div>
      )}

      {/* Hospital Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital, index) => (
          <Card key={hospital.id} variant="interactive" className="overflow-hidden">
            <div className="h-2 gradient-primary" />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  {hospital.distance && (
                    <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                      {hospital.distance} km away
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{hospital.rating}</span>
                </div>
              </div>
              <CardTitle className="text-lg mt-3">{hospital.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {hospital.city}, {hospital.state}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{hospital.address}</p>
              
              <div className="flex flex-wrap gap-1">
                {hospital.specializations.map((spec, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(`tel:${hospital.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button
                  variant="soft"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDirections(hospital.latitude, hospital.longitude)}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center text-center">
            <Stethoscope className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hospitals found matching your search</p>
          </CardContent>
        </Card>
      )}

      {/* Tip Card */}
      <Card variant="warm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center flex-shrink-0">
              💡
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-secondary-foreground mb-1">
                Tip for Parents
              </h3>
              <p className="text-secondary-foreground/80">
                When visiting a new hospital, carry your child's complete medical history, 
                including previous assessments, therapy reports, and any imaging studies. 
                This helps doctors provide better care. 📋
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalsPage;
