import axios from 'axios';
import { toast } from 'react-toastify';

import {LEADS_ENDPOINT} from '@/config/api';

type BrochureFormData = {
  name: string;
  email: string;
  phone: string;
  source: string; // Added source here
};

type SubmitOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

const useSubmitBrochureForm = () => {
  const submitForm = async (
    formData: BrochureFormData,
    options?: SubmitOptions
  ) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post<{ message: string; lead: unknown }>(
        LEADS_ENDPOINT,
        formData
      );

      toast.success('✅ Brochure request submitted successfully!');

      // Trigger brochure download
    //   const link = document.createElement('a');
    //   link.href = '/brochure.pdf';
    //   link.download = 'TownSquare-Brochure.pdf';
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);

    //   options?.onSuccess?.();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          '❌ Failed to submit. Please try again.';
        toast.error(message);
      } else {
        toast.error('❌ An unknown error occurred.');
      }

      console.error('Submission error:', error);
      options?.onError?.(error);
    }
  };

  return { submitForm };
};

export default useSubmitBrochureForm;
