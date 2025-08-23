import { useState, useCallback } from 'react';
import { userApi, storeApi, aiApi } from '../api/services';
import { createInitialApiState, updateApiState, createApiErrorMessage } from '../utils/apiUtils';

// API 상태 타입
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// API Hook 기본 타입
export interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// 공통 API Hook 팩토리 함수
const createApiHook = <T>(
  apiFunction: (...args: any[]) => Promise<T>,
  operationName: string
) => {
  return () => {
    const [state, setState] = useState<ApiState<T>>(createInitialApiState<T>());

    const execute = useCallback(async (...args: any[]) => {
      setState(prev => updateApiState.start(prev));
      try {
        const result = await apiFunction(...args);
        setState(updateApiState.success(result));
        return result;
      } catch (error) {
        const errorMessage = createApiErrorMessage(operationName, error);
        setState(updateApiState.error(errorMessage));
        throw error;
      }
    }, [apiFunction, operationName]);

    const reset = useCallback(() => {
      setState(createInitialApiState<T>());
    }, []);

    return {
      ...state,
      execute,
      reset,
    };
  };
};

// 사용자 API Hook
export const useUserApi = () => {
  const [signupState, setSignupState] = useState<ApiState<any>>(createInitialApiState());
  const [loginState, setLoginState] = useState<ApiState<any>>(createInitialApiState());
  const [emailCheckState, setEmailCheckState] = useState<ApiState<any>>(createInitialApiState());

  const signup = useCallback(async (data: any) => {
    setSignupState(prev => updateApiState.start(prev));
    try {
      const result = await userApi.signup(data);
      setSignupState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('회원가입', error);
      setSignupState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const login = useCallback(async (data: any) => {
    setLoginState(prev => updateApiState.start(prev));
    try {
      const result = await userApi.login(data);
      setLoginState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('로그인', error);
      setLoginState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const checkEmailDuplicate = useCallback(async (data: any) => {
    setEmailCheckState(prev => updateApiState.start(prev));
    try {
      const result = await userApi.checkEmailDuplicate(data);
      setEmailCheckState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('이메일 확인', error);
      setEmailCheckState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    userApi.logout();
    setLoginState(createInitialApiState());
  }, []);

  return {
    signup,
    signupState,
    login,
    loginState,
    checkEmailDuplicate,
    emailCheckState,
    logout,
  };
};

// 가맹점 API Hook
export const useStoreApi = () => {
  const [popularStoresState, setPopularStoresState] = useState<ApiState<any[]>>(createInitialApiState());
  const [nearbyStoresState, setNearbyStoresState] = useState<ApiState<any[]>>(createInitialApiState());
  const [storeDetailsState, setStoreDetailsState] = useState<ApiState<any>>(createInitialApiState());

  const getPopularStores = useCallback(async (params: any) => {
    setPopularStoresState(prev => updateApiState.start(prev));
    try {
      const result = await storeApi.getPopularStores(params);
      setPopularStoresState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('인기 가맹점 조회', error);
      setPopularStoresState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getNearbyStores = useCallback(async (params: any) => {
    setNearbyStoresState(prev => updateApiState.start(prev));
    try {
      const result = await storeApi.getNearbyStores(params);
      setNearbyStoresState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('주변 가맹점 조회', error);
      setNearbyStoresState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getStoreDetails = useCallback(async (storeId: number) => {
    setStoreDetailsState(prev => updateApiState.start(prev));
    try {
      const result = await storeApi.getStoreDetails(storeId);
      setStoreDetailsState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('가맹점 상세 정보 조회', error);
      setStoreDetailsState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  return {
    getPopularStores,
    popularStoresState,
    getNearbyStores,
    nearbyStoresState,
    getStoreDetails,
    storeDetailsState,
  };
};

// AI API Hook
export const useAiApi = () => {
  const [echoState, setEchoState] = useState<ApiState<any>>(createInitialApiState());
  const [pingState, setPingState] = useState<ApiState<string>>(createInitialApiState());

  const echo = useCallback(async (data: any) => {
    setEchoState(prev => updateApiState.start(prev));
    try {
      const result = await aiApi.echo(data);
      setEchoState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('AI 응답', error);
      setEchoState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const ping = useCallback(async () => {
    setPingState(prev => updateApiState.start(prev));
    try {
      const result = await aiApi.ping();
      setPingState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('AI 서버 연결', error);
      setPingState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  return {
    echo,
    echoState,
    ping,
    pingState,
  };
};
