import { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import logo from './assets/logo.png';
import { Sun, Moon } from 'lucide-react';

const localKey = 'auto-repair-data';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicles, setVehicles] = useState({});
  const [vehicleInputs, setVehicleInputs] = useState({});
  const [jobOrders, setJobOrders] = useState({});
  const [jobInputs, setJobInputs] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(localKey);
    if (data) {
      const parsed = JSON.parse(data);
      setCustomers(parsed);
      const vehicleMap = {}, jobMap = {};
      parsed.forEach(cust => {
        vehicleMap[cust.id] = cust.vehicles || [];
        jobMap[cust.id] = cust.jobs || [];
      });
      setVehicles(vehicleMap);
      setJobOrders(jobMap);
    }
  }, []);

  useEffect(() => {
    const updated = customers.map(cust => ({
      ...cust,
      vehicles: vehicles[cust.id] || [],
      jobs: jobOrders[cust.id] || []
    }));
    localStorage.setItem(localKey, JSON.stringify(updated));
  }, [customers, vehicles, jobOrders]);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('darkMode', darkMode);
}, [darkMode]);


  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') setDarkMode(true);
  }, []);

  const addCustomer = () => {
    if (!name.trim() || !phone.trim()) return alert('Please enter both name and phone number.');
    const id = Date.now();
    const newCustomer = { id, name, phone, vehicles: [], jobs: [] };
    setCustomers([...customers, newCustomer]);
    setName('');
    setPhone('');
  };

  const handleVehicleChange = (id, field, value) => {
    setVehicleInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const addVehicle = (custId) => {
    const vehicle = vehicleInputs[custId];
    if (!vehicle || !vehicle.make?.trim() || !vehicle.model?.trim()) return alert('Make and Model are required.');
    setVehicles(prev => ({
      ...prev,
      [custId]: [...(prev[custId] || []), { ...vehicle, id: Date.now() }]
    }));
    setVehicleInputs(prev => ({ ...prev, [custId]: {} }));
  };

  const handleJobInputChange = (id, field, value) => {
    setJobInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const addJob = (custId) => {
    const job = jobInputs[custId];
    if (!job || !job.description?.trim() || !job.cost?.trim()) return alert('Job description and cost are required.');
    setJobOrders(prev => ({
      ...prev,
      [custId]: [...(prev[custId] || []), { ...job, id: Date.now(), status: 'Pending' }]
    }));
    setJobInputs(prev => ({ ...prev, [custId]: {} }));
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-between items-center p-4 shadow bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Auto Repair Shop</h1>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button onClick={() => setShowSidebar(!showSidebar)}>Add Customer</Button>
        </div>
      </div>

      {showSidebar && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4 z-50">
          <h2 className="text-xl font-semibold">New Customer</h2>
          <Input
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button onClick={addCustomer}>Save</Button>
          <Button variant="outline" onClick={() => setShowSidebar(false)}>Close</Button>
        </div>
      )}

      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="grid gap-6">
          {customers.map((cust) => (
            <Card key={cust.id} className="dark:bg-gray-800">
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="font-medium text-lg">{cust.name}</p>
                  <p className="text-sm text-gray-400">ID: {cust.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{cust.phone}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="font-semibold text-md">Vehicles</h2>
                  {(vehicles[cust.id] || []).map((v) => (
                    <div key={v.id} className="text-sm border p-2 rounded bg-gray-100 dark:bg-gray-700">
                      {v.year} {v.make} {v.model} - {v.vin}
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <Input placeholder="Make" value={vehicleInputs[cust.id]?.make || ''} onChange={(e) => handleVehicleChange(cust.id, 'make', e.target.value)} />
                    <Input placeholder="Model" value={vehicleInputs[cust.id]?.model || ''} onChange={(e) => handleVehicleChange(cust.id, 'model', e.target.value)} />
                    <Input placeholder="Year" value={vehicleInputs[cust.id]?.year || ''} onChange={(e) => handleVehicleChange(cust.id, 'year', e.target.value)} />
                    <Input placeholder="VIN" value={vehicleInputs[cust.id]?.vin || ''} onChange={(e) => handleVehicleChange(cust.id, 'vin', e.target.value)} />
                    <Button onClick={() => addVehicle(cust.id)}>Add Vehicle</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="font-semibold text-md">Job Orders</h2>
                  {(jobOrders[cust.id] || []).map((job) => (
                    <div key={job.id} className="text-sm border p-2 rounded bg-green-50 dark:bg-green-900">
                      {job.description} - ${job.cost} [{job.status}]
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <Input placeholder="Job Description" value={jobInputs[cust.id]?.description || ''} onChange={(e) => handleJobInputChange(cust.id, 'description', e.target.value)} />
                    <Input placeholder="Cost" value={jobInputs[cust.id]?.cost || ''} onChange={(e) => handleJobInputChange(cust.id, 'cost', e.target.value)} />
                    <Button onClick={() => addJob(cust.id)}>Add Job</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

