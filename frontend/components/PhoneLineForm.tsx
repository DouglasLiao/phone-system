import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSubscriptionPlans, useCreatePhoneLine } from '../hooks/useApi'
import { useLanguage } from '../contexts/LanguageContext'
import { Phone, Building, CreditCard, Loader2 } from 'lucide-react'
import type { PhoneLineFormProps, PhoneLineFormData } from '../types'

const PhoneLineForm: React.FC<PhoneLineFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: subscriptionPlans, isLoading: plansLoading } = useSubscriptionPlans()
  const createPhoneLineMutation = useCreatePhoneLine()
  const { t } = useLanguage()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PhoneLineFormData>()

  const generateIdempotencyKey = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const onSubmit = async(data: PhoneLineFormData) => {
    setIsSubmitting(true)

    try {
      const idempotencyKey = generateIdempotencyKey()

      const phoneLineData = {
        areaCode: parseInt(data.areaCode),
        subscriptionPlanId: parseInt(data.subscriptionPlanId)
      }

      await createPhoneLineMutation.mutateAsync({
        phoneLineData,
        idempotencyKey
      })

      reset()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error creating line:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="ml-2 text-text-muted">{t('form.loading_plans')}</span>
      </div>
    )
  }

  return (
    <div className="bg-primary rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Phone className="w-6 h-6 text-secondary mr-2" />
        <h2 className="text-2xl font-bold text-secondary">{t('form.new_phone_line')}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-text mb-2">
            <Building className="w-4 h-4 mr-1" />
            {t('form.area_code')}
          </label>
          <select
            {...register('areaCode', {
              required: t('form.area_code_required')
            })}
            className="w-full px-3 py-2 border border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-text"
          >
            <option value="">{t('form.select_area_code')}</option>
            <option value="11">11 - {t('area.sao_paulo')}</option>
            <option value="21">21 - {t('area.rio_de_janeiro')}</option>
            <option value="31">31 - {t('area.belo_horizonte')}</option>
            <option value="41">41 - {t('area.curitiba')}</option>
            <option value="51">51 - {t('area.porto_alegre')}</option>
            <option value="61">61 - {t('area.brasilia')}</option>
            <option value="71">71 - {t('area.salvador')}</option>
            <option value="81">81 - {t('area.recife')}</option>
            <option value="85">85 - {t('area.fortaleza')}</option>
            <option value="92">92 - {t('area.manaus')}</option>
          </select>
          {errors.areaCode && (
            <p className="mt-1 text-sm text-red-600">{errors.areaCode.message as string}</p>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-text mb-2">
            <CreditCard className="w-4 h-4 mr-1" />
            {t('form.subscription_plan')}
          </label>
          <select
            {...register('subscriptionPlanId', {
              required: t('form.subscription_plan_required')
            })}
            className="w-full px-3 py-2 border border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-text"
          >
            <option value="">{t('form.select_plan')}</option>
            {subscriptionPlans?.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
          {errors.subscriptionPlanId && (
            <p className="mt-1 text-sm text-red-600">{errors.subscriptionPlanId.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary hover:bg-secondary-light disabled:bg-text-muted text-primary font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {t('form.creating_line')}
            </>
          ) : (
            t('form.create_phone_line')
          )}
        </button>

        {createPhoneLineMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">
              {t('form.error_creating_line')}: {createPhoneLineMutation.error.response?.data?.message || t('common.error')}
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default PhoneLineForm
