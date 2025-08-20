import { findSimilarMotors } from '@/lib/data';
import MotorDetailsClientPage from '@/components/motor-details-client-page';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type MotorDetailsPageProps = {
  params: {
    motor_code: string;
  };
};

export default async function MotorDetailsPage({ params }: MotorDetailsPageProps) {
  const motorCode = decodeURIComponent(params.motor_code);
  const { originalMotor, similarMotors } = await findSimilarMotors(motorCode);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline">Motor Details</h1>
          {originalMotor ? (
            <p className="text-muted-foreground">
              Showing details for motor <span className="font-bold text-primary">{motorCode}</span> and its equivalents.
            </p>
          ) : (
             <p className="text-destructive">
              Motor with code <span className="font-bold">{motorCode}</span> not found.
            </p>
          )}
        </div>
      </div>
      
      <MotorDetailsClientPage originalMotor={originalMotor} similarMotors={similarMotors} />
    </main>
  );
}
