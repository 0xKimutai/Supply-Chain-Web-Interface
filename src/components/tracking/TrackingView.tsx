import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User as UserIcon, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package
} from 'lucide-react';

interface TrackingEvent {
  id: number;
  eventType: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
  updatedBy: string;
}

const TrackingView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`/api/v1/product-tracking/${id}/tracking?includeHistory=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch tracking history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'CREATION': return <Package className="w-5 h-5" />;
      case 'LOCATION_UPDATE': return <Truck className="w-5 h-5" />;
      case 'OWNERSHIP_TRANSFER': return <UserIcon className="w-5 h-5" />;
      case 'QUALITY_CHECK': return <CheckCircle2 className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/dashboard/products')}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Chain of Custody</h1>
          <p className="text-slate-500 mt-1">Blockchain history for product <span className="font-mono text-indigo-600">{id}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
        {loading ? (
          <div className="flex flex-col items-center py-20 space-y-4">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
             <p className="text-slate-500 font-medium">Querying ledger...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500 font-medium">No tracking events found for this product yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-10 md:left-20 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-100 rounded-full opacity-20"></div>

            <div className="space-y-12">
              {events.map((event) => (
                <div key={event.id} className="relative flex items-start group">
                  {/* Timeline Dot & Icon */}
                  <div className={`w-20 md:w-40 flex-shrink-0 flex justify-end pr-8 md:pr-16 transition-all duration-300 group-hover:scale-110`}>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-slate-50 border-2 border-indigo-100 z-10 relative">
                      {getEventIcon(event.eventType)}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-bold text-slate-900 text-lg capitalize">
                            {event.eventType.toLowerCase().replace('_', ' ')}
                          </h3>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {event.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2 md:mt-0 uppercase tracking-widest">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3 text-slate-600">
                          <MapPin className="w-5 h-5 text-slate-400" />
                          <div className="text-sm">
                            <p className="font-bold">Location</p>
                            <p className="text-slate-500">{event.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-slate-600">
                          <UserIcon className="w-5 h-5 text-slate-400" />
                          <div className="text-sm">
                            <p className="font-bold">Managed By</p>
                            <p className="font-mono text-[10px] text-slate-500 line-clamp-1">{event.updatedBy}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200/50">
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{event.description}"
                        </p>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button className="flex items-center space-x-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                          <span>Verified on Ledger</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingView;
