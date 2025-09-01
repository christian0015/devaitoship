// import PublicLayout from "@/layouts/PublicLayout";
"use client"; // 👈 si tu es en Next.js 13+ avec app/

import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@InstallerSection.module.css";

const InstallationForm: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 3 && (
        <div className={styles.stepContent}>
          <div className={styles.success}>
            <h2>Installation terminée!</h2>
            <p>Votre boutique a été configurée avec succès.</p>
            <button
              onClick={() => router.push("/admin")}
              className={styles.button}
            >
              Accéder à votre espace admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallationForm;
