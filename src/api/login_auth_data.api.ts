import axiosInstance from "./axios";

// Interfejs dla danych uwierzytelniających
export interface DaneLogowania {
  username: string;
  password: string;
}

// Interfejs dla odpowiedzi z logowania
export interface OdpowiedzLogowania {
  success: boolean;
  userRole?: "admin" | "staff" | "supplier";
  userId?: string;
  error?: string;
}

/**
 * Loguje użytkownika do systemu
 * @param credentials Dane logowania (username, password)
 * @returns Odpowiedź z informacją o sukcesie, roli użytkownika i ewentualnym błędzie
 */
export const zaloguj = async (credentials: DaneLogowania): Promise<OdpowiedzLogowania> => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as OdpowiedzLogowania;
    }

    return {
      success: false,
      error: "Błąd połączenia z serwerem",
    };
  }
};
