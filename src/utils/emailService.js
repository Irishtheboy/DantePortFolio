// Email notification service using EmailJS
export const sendEmailNotification = async (type, data) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_killydid',
        template_id: type === 'booking' ? 'template_booking' : 'template_message',
        user_id: 'your_emailjs_user_id',
        template_params: {
          to_email: 'Magamasinethemba@gmail.com',
          from_name: data.name,
          from_email: data.email,
          subject: type === 'booking' ? `New Booking Request - ${data.serviceName}` : `New Message - ${data.subject}`,
          message: type === 'booking' 
            ? `New booking request from ${data.name}\n\nService: ${data.serviceName}\nPrice: ${data.servicePrice}\nDate: ${data.date}\nLocation: ${data.location}\nPhone: ${data.phone}\nEmail: ${data.email}\n\nDetails:\n${data.message}`
            : `New message from ${data.name}\n\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
          reply_to: data.email
        }
      })
    });

    if (response.ok) {
      console.log('Email notification sent successfully');
    }
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
};