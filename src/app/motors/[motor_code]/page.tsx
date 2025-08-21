import { findSimilarMotors, findStandbyMotors } from '@/lib/data';
import MotorDetailsClientPage from '@/components/motor-details-client-page';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AISuggestion from '@/components/ai-suggestion';

type MotorDetailsPageProps = {
  params: {
    motor_code: string;
  };
};

export default async function MotorDetailsPage({ params }: MotorDetailsPageProps) {
  const motorCode = decodeURIComponent(params.motor_code);
  const { originalMotor, similarMotors } = await findSimilarMotors(motorCode);
  const standbyMotors = await findStandbyMotors(motorCode);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la búsqueda
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline">Detalles del Motor</h1>
          {originalMotor ? (
            <p className="text-muted-foreground">
              Se muestran los detalles para el motor <span className="font-bold text-primary">{motorCode}</span>
              {originalMotor.equipment && <> que opera como <span className="font-semibold text-foreground">{originalMotor.equipment}</span></>}
            </p>
          ) : (
             <p className="text-destructive">
              Motor con código <span className="font-bold">{motorCode}</span> no encontrado.
            </p>
          )}
        </div>
        {originalMotor && originalMotor.equipment && (
          <div>
            <AISuggestion motor={originalMotor} />
          </div>
        )}
      </div>
      
      <MotorDetailsClientPage 
        originalMotor={originalMotor} 
        similarMotors={similarMotors}
        standbyMotors={standbyMotors}
      />
    </main>
  );
}
