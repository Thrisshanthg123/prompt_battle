import React, { useState } from 'react';
import { User, Phone, ShieldCheck, Save, Mail, School, MapPin, HeartHandshake } from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function StudentProfile() {
  const { studentProfile, updateStudentProfile } = useMobility();

  const [formData, setFormData] = useState({
    name: studentProfile.name || '',
    email: studentProfile.email || '',
    phone: studentProfile.phone || '',
    institution: studentProfile.institution || '',
    branch: studentProfile.branch || '',
    studentIdCard: studentProfile.studentIdCard || '',
    emergencyName: studentProfile.emergencyContact?.name || '',
    emergencyPhone: studentProfile.emergencyContact?.phone || '',
    emergencyRelation: studentProfile.emergencyContact?.relation || '',
    homeStop: studentProfile.homeStop || '',
    collegeStop: studentProfile.collegeStop || '',
    passNumber: studentProfile.passNumber || '',
    shareLocationWithEmergencyContact: studentProfile.shareLocationWithEmergencyContact ?? true,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudentProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      institution: formData.institution,
      branch: formData.branch,
      studentIdCard: formData.studentIdCard,
      homeStop: formData.homeStop,
      collegeStop: formData.collegeStop,
      passNumber: formData.passNumber,
      shareLocationWithEmergencyContact: formData.shareLocationWithEmergencyContact,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation,
      },
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Student Transit Profile</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Member 1
          </span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your verified college credentials, emergency contact routing, and daily transit concessions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & College Credentials */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Academic & Personal Details</h2>
              <p className="text-xs text-slate-500">Used for student identification on community pools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address (.edu / .ac.in preferred)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College ID Card Number
              </label>
              <input
                type="text"
                value={formData.studentIdCard}
                onChange={(e) => setFormData({ ...formData, studentIdCard: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College / Institution Name
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department & Year
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Emergency Safety Contact & SOS Settings */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Emergency & SOS Safety Contact</h2>
              <p className="text-xs text-slate-500">
                Receives automated GPS alerts when an SOS is triggered during active rides
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Name
              </label>
              <input
                type="text"
                required
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Relationship
              </label>
              <input
                type="text"
                value={formData.emergencyRelation}
                onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Parent / Guardian"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <input
              type="checkbox"
              id="shareGps"
              checked={formData.shareLocationWithEmergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, shareLocationWithEmergencyContact: e.target.checked })
              }
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="shareGps" className="text-xs text-slate-700 font-medium">
              Automatically broadcast live tracking link to emergency contact upon vehicle match
            </label>
          </div>
        </div>

        {/* Regular Transit Corridor & Pass Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Regular Transit Corridor</h2>
              <p className="text-xs text-slate-500">Pre-populates your Journey Request form for instant booking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Default Home Bus Stop
              </label>
              <input
                type="text"
                value={formData.homeStop}
                onChange={(e) => setFormData({ ...formData, homeStop: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College Campus Stop
              </label>
              <input
                type="text"
                value={formData.collegeStop}
                onChange={(e) => setFormData({ ...formData, collegeStop: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                KSRTC / Bus Pass Number
              </label>
              <input
                type="text"
                value={formData.passNumber}
                onChange={(e) => setFormData({ ...formData, passNumber: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 animate-pulse">
              ✓ Changes saved to local storage!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
