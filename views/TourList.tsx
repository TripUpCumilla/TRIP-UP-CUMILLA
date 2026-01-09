
import React, { useState } from 'react';
import { Card, Button, Input, Label } from '../components/SharedUI';
import { Plus, Search, Calendar, User, Users, Trash2, Map, Banknote } from 'lucide-react';
import { Tour } from '../types';

interface TourListProps {
  tours: Tour[];
  onAddTour: (tour: Partial<Tour>) => void;
  onSelectTour: (tour: Tour) => void;
  onDeleteTour: (id: string) => void;
}

const TourList: React.FC<TourListProps> = ({ tours, onAddTour, onSelectTour, onDeleteTour }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Tour>>({
    tourName: '',
    tourDate: '',
    hostName: '',
    totalSeats: 20,
    pricePerSeat: 0,
    description: ''
  });

  const filteredTours = tours.filter(t => 
    t.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.hostName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTour(formData);
    setShowModal(false);
    setFormData({ tourName: '', tourDate: '', hostName: '', totalSeats: 20, pricePerSeat: 0, description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Tour Management</h2>
          <p className="text-zinc-400">Create and manage your upcoming adventures.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>New Tour Event</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <Input 
          placeholder="Search by tour name or host..." 
          className="pl-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <Card key={tour.id} className="group relative border-transparent hover:border-red-900/50 transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-950/20 text-red-500 rounded-xl">
                  <Map size={24} />
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onDeleteTour(tour.id)} className="p-2 text-zinc-500 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold line-clamp-1">{tour.tourName}</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-4 flex items-center">
                <Calendar size={14} className="mr-1.5" />
                {new Date(tour.tourDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
              </p>

              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 flex items-center"><User size={14} className="mr-1.5"/> Host</span>
                  <span className="font-semibold">{tour.hostName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 flex items-center"><Users size={14} className="mr-1.5"/> Seats</span>
                  <span className="font-semibold">{tour.totalSeats} Available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 flex items-center"><Banknote size={14} className="mr-1.5"/> Price</span>
                  <span className="font-bold text-emerald-500">৳{tour.pricePerSeat || 0}</span>
                </div>
              </div>

              <Button 
                onClick={() => onSelectTour(tour)}
                variant="outline" 
                className="w-full mt-6 group-hover:bg-red-900 group-hover:text-white transition-all"
              >
                Manage Tour
              </Button>
            </div>
          </Card>
        ))}

        {filteredTours.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex p-6 bg-zinc-900 rounded-full text-zinc-700 mb-4">
              <Map size={48} />
            </div>
            <p className="text-xl text-zinc-500 font-medium">No tours found</p>
            <p className="text-zinc-600">Start by creating your first tour event</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-lg p-6 bg-zinc-900 shadow-2xl border-red-900/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create Tour Event</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tour Name</Label>
                <Input required value={formData.tourName} onChange={(e) => setFormData({...formData, tourName: e.target.value})} placeholder="e.g. Sylhet Dream Expedition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input required type="date" value={formData.tourDate} onChange={(e) => setFormData({...formData, tourDate: e.target.value})} />
                </div>
                <div>
                  <Label>Total Seats</Label>
                  <Input required type="number" value={formData.totalSeats} onChange={(e) => setFormData({...formData, totalSeats: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <Label>Price per Seat (৳)</Label>
                <Input required type="number" value={formData.pricePerSeat} onChange={(e) => setFormData({...formData, pricePerSeat: Number(e.target.value)})} placeholder="Base price per person" />
              </div>
              <div>
                <Label>Host Name</Label>
                <Input required value={formData.hostName} onChange={(e) => setFormData({...formData, hostName: e.target.value})} placeholder="Person managing this tour" />
              </div>
              <div>
                <Label>Notes / Description</Label>
                <textarea 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-900/50"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Optional details..."
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Create Tour</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TourList;
