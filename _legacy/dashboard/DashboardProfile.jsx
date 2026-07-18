const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Building2, Plus, MapPin, Phone, User, Pencil, Trash2, Check, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const bizTypes = [
  { value: 'cafe',       label: 'Café' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hotel',      label: 'Hotel' },
  { value: 'retail',     label: 'Retail' },
  { value: 'office',     label: 'Office' },
  { value: 'other',      label: 'Other' },
];

const locationTypes = [
  { value: 'headquarters', label: 'HQ' },
  { value: 'branch',       label: 'Branch' },
  { value: 'store',        label: 'Store' },
  { value: 'office',       label: 'Office' },
];

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide block mb-2">{label}</label>
      {children}
    </div>
  );
}

function LocationCard({ location, onEdit, onDelete }) {
  const typeLabel = locationTypes.find(t => t.value === location.type)?.label || 'Branch';
  return (
    <div className="bg-white rounded-3xl border border-border/50 p-5 flex gap-4">
      <div className="w-10 h-10 rounded-2xl bg-soft-blue/30 flex items-center justify-center flex-shrink-0">
        <MapPin className="w-4 h-4 text-cobalt" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-semibold text-sm">{location.name}</p>
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground mt-0.5">{typeLabel}</span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => onEdit(location)} className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(location.id)} className="p-1.5 rounded-full hover:bg-destructive/8 hover:text-destructive transition-colors text-muted-foreground">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">{location.address}{location.city ? `, ${location.city}` : ''}</p>
        {location.contact_person && (
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground/70"><User className="w-3 h-3" />{location.contact_person}</span>
            {location.phone && <span className="flex items-center gap-1 text-xs text-muted-foreground/70"><Phone className="w-3 h-3" />{location.phone}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

const emptyLocation = { name: '', type: 'branch', address: '', city: '', country: '', contact_person: '', phone: '' };

export default function DashboardProfile() {
  const queryClient = useQueryClient();
  const [editingBiz, setEditingBiz] = useState(false);
  const [bizForm, setBizForm]       = useState({ business_name: '', business_type: 'cafe', description: '' });
  const [saving, setSaving]         = useState(false);
  const [showLocForm, setShowLocForm] = useState(false);
  const [editingLoc, setEditingLoc]   = useState(null);
  const [locForm, setLocForm]         = useState(emptyLocation);

  const { data: profiles = [], isLoading: bizLoading } = useQuery({
    queryKey: ['biz-profile'],
    queryFn: () => db.entities.BusinessProfile.list(),
  });

  const { data: locations = [], isLoading: locLoading } = useQuery({
    queryKey: ['biz-locations'],
    queryFn: () => db.entities.BusinessLocation.list(),
  });

  const profile = profiles[0] || null;

  useEffect(() => {
    if (profile) setBizForm({ business_name: profile.business_name, business_type: profile.business_type || 'cafe', description: profile.description || '' });
  }, [profile]);

  const saveBiz = async () => {
    setSaving(true);
    if (profile) {
      await db.entities.BusinessProfile.update(profile.id, bizForm);
    } else {
      await db.entities.BusinessProfile.create(bizForm);
    }
    queryClient.invalidateQueries({ queryKey: ['biz-profile'] });
    setEditingBiz(false);
    setSaving(false);
    toast.success('Business profile saved');
  };

  const openLocForm = (loc = null) => {
    setEditingLoc(loc);
    setLocForm(loc ? { name: loc.name, type: loc.type, address: loc.address, city: loc.city || '', country: loc.country || '', contact_person: loc.contact_person || '', phone: loc.phone || '' } : emptyLocation);
    setShowLocForm(true);
  };

  const saveLoc = async () => {
    setSaving(true);
    if (editingLoc) {
      await db.entities.BusinessLocation.update(editingLoc.id, locForm);
    } else {
      await db.entities.BusinessLocation.create(locForm);
    }
    queryClient.invalidateQueries({ queryKey: ['biz-locations'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-locations'] });
    setShowLocForm(false);
    setSaving(false);
    toast.success(editingLoc ? 'Location updated' : 'Location added');
  };

  const deleteLoc = async (id) => {
    await db.entities.BusinessLocation.delete(id);
    queryClient.invalidateQueries({ queryKey: ['biz-locations'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-locations'] });
    toast.success('Location removed');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Business Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your business information and locations.</p>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-3xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />Business Information
          </h2>
          {!editingBiz && (
            <button onClick={() => setEditingBiz(true)} className="flex items-center gap-1.5 text-xs font-medium text-cobalt hover:opacity-80 transition-opacity">
              <Pencil className="w-3.5 h-3.5" />Edit
            </button>
          )}
        </div>

        {bizLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-10 rounded-2xl" />)}</div>
        ) : editingBiz ? (
          <div className="space-y-5">
            <Field label="Business Name">
              <Input value={bizForm.business_name} onChange={e => setBizForm(p => ({...p, business_name: e.target.value}))}
                placeholder="Acme Coffee Co." className="rounded-2xl h-12" />
            </Field>
            <Field label="Business Type">
              <div className="flex flex-wrap gap-2">
                {bizTypes.map(t => (
                  <button key={t.value} onClick={() => setBizForm(p => ({...p, business_type: t.value}))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${bizForm.business_type === t.value ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:bg-secondary/70'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Description">
              <Textarea value={bizForm.description} onChange={e => setBizForm(p => ({...p, description: e.target.value}))}
                placeholder="Tell us about your business…" className="rounded-2xl min-h-[80px] resize-none" />
            </Field>
            <div className="flex gap-3 pt-2">
              <Button onClick={saveBiz} disabled={saving || !bizForm.business_name.trim()}
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-10 px-6 shadow-none text-sm">
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setEditingBiz(false)} className="rounded-full h-10 px-5 text-sm">Cancel</Button>
            </div>
          </div>
        ) : profile ? (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Business Name</p>
              <p className="font-semibold">{profile.business_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="font-semibold capitalize">{bizTypes.find(t => t.value === profile.business_type)?.label || '—'}</p>
            </div>
            {profile.description && (
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{profile.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No business information yet</p>
            <Button onClick={() => setEditingBiz(true)} variant="outline" className="rounded-full h-10 px-5 text-sm gap-2">
              <Plus className="w-4 h-4" />Add Business Info
            </Button>
          </div>
        )}
      </div>

      {/* Locations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />Branches & Locations
          </h2>
          {!showLocForm && (
            <button onClick={() => openLocForm()} className="flex items-center gap-1.5 text-xs font-medium text-cobalt hover:opacity-80 transition-opacity">
              <Plus className="w-3.5 h-3.5" />Add Location
            </button>
          )}
        </div>

        {/* Add / Edit form */}
        <AnimatePresence>
          {showLocForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white rounded-3xl border border-cobalt/20 p-6 space-y-4">
                <p className="font-heading font-semibold text-sm">{editingLoc ? 'Edit Location' : 'New Location'}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Location Name">
                    <Input value={locForm.name} onChange={e => setLocForm(p => ({...p, name: e.target.value}))} placeholder="Main Branch" className="rounded-2xl h-11" />
                  </Field>
                  <Field label="Type">
                    <div className="flex gap-2 flex-wrap">
                      {locationTypes.map(t => (
                        <button key={t.value} onClick={() => setLocForm(p => ({...p, type: t.value}))}
                          className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all ${locForm.type === t.value ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:bg-secondary/70'}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Address">
                    <Input value={locForm.address} onChange={e => setLocForm(p => ({...p, address: e.target.value}))} placeholder="123 Main St" className="rounded-2xl h-11" />
                  </Field>
                  <Field label="City">
                    <Input value={locForm.city} onChange={e => setLocForm(p => ({...p, city: e.target.value}))} placeholder="New York" className="rounded-2xl h-11" />
                  </Field>
                  <Field label="Contact Person">
                    <Input value={locForm.contact_person} onChange={e => setLocForm(p => ({...p, contact_person: e.target.value}))} placeholder="Jane Doe" className="rounded-2xl h-11" />
                  </Field>
                  <Field label="Phone">
                    <Input value={locForm.phone} onChange={e => setLocForm(p => ({...p, phone: e.target.value}))} placeholder="+1 555 000 0000" className="rounded-2xl h-11" />
                  </Field>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button onClick={saveLoc} disabled={saving || !locForm.name.trim() || !locForm.address.trim()}
                    className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-10 px-6 shadow-none text-sm">
                    {saving ? 'Saving…' : editingLoc ? 'Update' : 'Add Location'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowLocForm(false)} className="rounded-full h-10 px-5 text-sm">Cancel</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {locLoading ? (
          <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-24 rounded-3xl" />)}</div>
        ) : locations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border/50 p-10 text-center">
            <MapPin className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No locations added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map(loc => (
              <LocationCard key={loc.id} location={loc} onEdit={openLocForm} onDelete={deleteLoc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}