import { IncidentEvent } from '@/types';

/**
 * Exports a list of incidents to a CSV file and triggers download in browser
 */
export function exportIncidentsToCSV(incidents: IncidentEvent[], filename = 'urbansense_incidents_report.csv') {
  if (!incidents || incidents.length === 0) {
    alert('No incident records to export.');
    return;
  }

  const headers = [
    'Incident ID',
    'Type',
    'Severity',
    'Assigned Department',
    'Status',
    'AI Confidence',
    'Timestamp (ISO)',
    'Bus ID',
    'Route ID',
    'Latitude',
    'Longitude',
    'Vehicle ID',
    'License Plate',
    'Work Order ID',
    'Description',
  ];

  const csvRows = incidents.map((inc) => {
    return [
      `"${inc.id}"`,
      `"${inc.type}"`,
      `"${inc.severity}"`,
      `"${inc.assigned_department || 'unassigned'}"`,
      `"${inc.status}"`,
      `"${(inc.confidence * 100).toFixed(1)}%"`,
      `"${inc.timestamp}"`,
      `"${inc.bus_id}"`,
      `"${inc.route_id}"`,
      `"${inc.latitude.toFixed(6)}"`,
      `"${inc.longitude.toFixed(6)}"`,
      `"${inc.vehicle_id || 'N/A'}"`,
      `"${inc.license_plate || 'N/A'}"`,
      `"${inc.work_order_id || 'N/A'}"`,
      `"${inc.description.replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...csvRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
