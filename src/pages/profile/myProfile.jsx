import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ButtonLoading from 'components/ButtonLoading';
import Input from 'components/Input';
import { EDITAR_PERFIL } from 'graphql/usuarios/mutations';
import useFormData from 'hooks/useFormData';
import { uploadFormData } from 'utils/uploadFormData';
import { useUser } from 'context/userContext';
import { GET_USUARIO } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';

const Profile = () => {
  const [editFoto, setEditFoto] = useState(false);
  const { form, formData, updateFormData } = useFormData();
  const { userData, setUserData } = useUser();

  const [editarPerfil, { data: dataMutation, error: errorMutation, loading: loadingMutation }] =
    useMutation(EDITAR_PERFIL);

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_USUARIO, {
    variables: {
      _id: userData._id,
    },
  });

  useEffect(() => {
    if (dataMutation) {
      console.log('data mutation', dataMutation);
      setUserData({ ...userData, foto: dataMutation.editarPerfil.foto });
      toast.success('Perfil modificado con exito');
      refetch();
    }
  }, [dataMutation]);

  useEffect(() => {
    console.log('ud', queryData);
  }, [queryData]);

  const submitForm = async (e) => {
    e.preventDefault();

    const formUploaded = await uploadFormData(formData);

    console.log('form cargado', formUploaded);

    editarPerfil({
      variables: {
        _id: userData._id,
        campos: formUploaded,
      },
    });
  };

  if (queryLoading) return <div>Loading...</div>;

  return (
    <div className='p-16 flex flex-col items-center justify-center w-full font-bold bg-blue-200'>
      <h1 className='font-bold text-2xl text-gray-900'>Perfil del Usuario</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input
          defaultValue={queryData.Usuario.nombre}
          label='Nombre'
          name='nombre'
          type='text'
          required={true}
          
        />
        <Input
          defaultValue={queryData.Usuario.apellido}
          label='Apellidos'
          name='apellido'
          type='text'
          required={true}
        />
        <Input
          defaultValue={queryData.Usuario.identificacion}
          label='Identificación'
          name='identificacion'
          type='text'
          required={true}
        />
        {queryData.Usuario.foto && !editFoto ? (
          <div className='flex flex-col items-center'>
            <img className='h-32' src={queryData.Usuario.foto} alt='Foto Usuario' />
            <button
              onClick={() => setEditFoto(true)}
              className='bg-indigo-300 p-1 my-2 rounded-md text-white'
            >
              Cambiar imagen
            </button>
          </div>
        ) : (
          <center>
          <div>
            <Input label='Foto' name='foto' type='file' required={true} />
            <button
              onClick={() => setEditFoto(false)}
              className={"w-48 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
            >
              Cancelar
            </button>
          </div>
          </center>
        )}
        <center>
        <ButtonLoading 
          text='Confirmar' 
          loading={loadingMutation} 
          disabled={false} 
          className={"w-48 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
        />
        </center>
      </form>
    </div>
  );
};

export default Profile;