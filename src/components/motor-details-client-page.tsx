'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SimilarMotorData } from '@/lib/types';
import AISuggestion from './ai-suggestion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type MotorDetailsClientPageProps = {
  originalMotor: SimilarMotorData | null;
  similarMotors: SimilarMotorData[];
  standbyMotors: SimilarMotorData[];
};

export default function MotorDetailsClientPage({ originalMotor, similarMotors, standbyMotors }: MotorDetailsClientPageProps) {
  if (!originalMotor) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Motor Found</CardTitle>
          <CardDescription>The requested motor code could not be found. Please check the code and try again.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const allMotors = [originalMotor, ...similarMotors.filter(m => m.motor_code !== originalMotor.motor_code)];
  const uniqueMotors = Array.from(new Map(allMotors.map(m => [m.motor_code, m])).values());


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Equivalent Motors</CardTitle>
          <CardDescription>The highlighted row is the motor you searched for.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plant Code</TableHead>
                  <TableHead>Motor Code</TableHead>
                  <TableHead>Similar To</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Pallet</TableHead>
                  <TableHead>Shaft Dia. (d)</TableHead>
                  <TableHead>Power (kW)</TableHead>
                  <TableHead>RPM</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueMotors.map((motor, index) => (
                  <TableRow key={index} className={motor.motor_code === originalMotor.motor_code ? 'bg-primary/10' : ''}>
                    <TableCell>{motor.plant_code || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{motor.motor_code}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {motor.similar.length > 0 ? motor.similar.map(s => <Badge key={s} variant="secondary">{s}</Badge>) : 'None'}
                      </div>
                    </TableCell>
                    <TableCell>{motor.ubication || 'N/A'}</TableCell>
                    <TableCell>{motor.pallet || 'N/A'}</TableCell>
                    <TableCell>{motor.med_d}</TableCell>
                    <TableCell>{motor.power}</TableCell>
                    <TableCell>{motor.rpm}</TableCell>
                    <TableCell>
                      <AISuggestion motor={motor} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {standbyMotors.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Another possible standby</CardTitle>
            <CardDescription>
              Motors with compatible dimensions and equal or greater power.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plant Code</TableHead>
                    <TableHead>Motor Code</TableHead>
                    <TableHead>Similar To</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Pallet</TableHead>
                    <TableHead>Shaft Dia. (d)</TableHead>
                    <TableHead>Power (kW)</TableHead>
                    <TableHead>RPM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standbyMotors.map((motor, index) => (
                    <TableRow key={index}>
                      <TableCell>{motor.plant_code || 'N/A'}</TableCell>
                      <TableCell className="font-medium">{motor.motor_code}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {motor.similar.length > 0 ? motor.similar.map(s => <Badge key={s} variant="secondary">{s}</Badge>) : 'None'}
                        </div>
                      </TableCell>
                      <TableCell>{motor.ubication || 'N/A'}</TableCell>
                      <TableCell>{motor.pallet || 'N/A'}</TableCell>
                      <TableCell>{motor.med_d}</TableCell>
                      <TableCell>{motor.power}</TableCell>
                      <TableCell>{motor.rpm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
